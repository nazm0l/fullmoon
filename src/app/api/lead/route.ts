import { NextRequest, NextResponse } from "next/server";
import { leadFormSchema, normalizeBdPhone } from "@/lib/validate";

// In-memory rate limiting map: ip -> timestamps[]
// Note: In serverless environments (e.g. Vercel), memory is not shared across instances/lambdas.
// This serves only as a light best-effort deterrent against rapid single-client spam.
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

function getDhakaTimeString(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${formatter.format(now).replace(" ", "T")}+06:00`;
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP and Rate Limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "অনেক বেশি অনুরোধ পাঠানো হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।" },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Request Body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "ভুল তথ্য বিন্যাস।" },
        { status: 400 }
      );
    }

    const parseResult = leadFormSchema.safeParse(body);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = parseResult.error.issues || [];
      issues.forEach((err) => {
        const field = err.path[0];
        if (field) {
          fieldErrors[field.toString()] = err.message;
        }
      });

      return NextResponse.json(
        { ok: false, errors: fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 3. Honeypot check & timing check (< 3 seconds after page render)
    // Silently return 200 { ok: true } to not tip off spammers/bots
    const isHoneypotFilled = Boolean(data.company && data.company.trim().length > 0);
    const isSubmittedTooFast = Boolean(data.ts && Date.now() - data.ts < 3000);

    if (isHoneypotFilled || isSubmittedTooFast) {
      console.warn(`[SPAM_DETECTED] Honeypot: ${isHoneypotFilled}, TooFast: ${isSubmittedTooFast}`);
      return NextResponse.json({ ok: true });
    }

    // 4. Normalise Phone & Build Lead Record
    const normalizedPhone = normalizeBdPhone(data.phone);
    const createdAt = getDhakaTimeString();
    const unitPrice = 5700;
    const totalAmount = data.persons * unitPrice;
    const formattedAmount = `${totalAmount.toLocaleString("en-BD")} TK`;

    const paymentMethodLabel = data.paymentMethod === "bank" ? "City Bank Transfer" : "bKash";

    const leadRecord = {
      createdAt,
      name: data.name,
      phone: normalizedPhone,
      persons: data.persons,
      totalAmount: formattedAmount,
      paymentMethod: paymentMethodLabel,
      transactionId: data.transactionId,
      // Keep adults populated for backward-compatibility with sheets
      adults: data.persons,
      children: 0,
      note: data.note || "",
      utm_source: data.utm_source || "",
      utm_medium: data.utm_medium || "",
      utm_campaign: data.utm_campaign || "",
      utm_content: data.utm_content || "",
      referrer: data.referrer || "",
      page_url: data.page_url || "",
    };

    // 5. Check MOCK_LEADS Mode (for local development & testing)
    const isMock = process.env.MOCK_LEADS === "true" || !process.env.GOOGLE_SCRIPT_URL;

    if (isMock) {
      console.log("-----------------------------------------");
      console.log("🌟 [MOCK_LEAD_RECEIVED] Stored successfully:");
      console.log(JSON.stringify(leadRecord, null, 2));
      console.log("-----------------------------------------");
    } else {
      // Send to Google Apps Script
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      try {
        const scriptPayload = {
          ...leadRecord,
          secret: process.env.GOOGLE_SCRIPT_SECRET,
        };

        const googleRes = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(scriptPayload),
          redirect: "follow",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!googleRes.ok) {
          throw new Error(`Google Apps Script responded with status: ${googleRes.status}`);
        }

        const scriptJson = await googleRes.json().catch(() => null);
        if (scriptJson && scriptJson.ok === false) {
          throw new Error(`Google Apps Script error: ${scriptJson.error}`);
        }
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        // Never log the secret
        console.error("Failed to forward lead to Google Apps Script:", (err as Error).message);
        return NextResponse.json(
          { ok: false, error: "বুকিং সেবায় সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে WhatsApp-এ যোগাযোগ করুন।" },
          { status: 502 }
        );
      }
    }

    // 6. Optional Telegram Alert (failures do NOT fail the request)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const tgMessage =
          `🌕 *New Full Moon Booking Lead (Paid)*\n\n` +
          `👤 *Name:* ${leadRecord.name}\n` +
          `📞 *Phone:* \`${leadRecord.phone}\`\n` +
          `👥 *Persons:* ${leadRecord.persons} জন\n` +
          `💰 *Total Amount:* ${leadRecord.totalAmount}\n` +
          `💳 *Payment Method:* ${leadRecord.paymentMethod}\n` +
          `🔖 *TrxID / Ref:* \`${leadRecord.transactionId}\`\n` +
          (leadRecord.note ? `📝 *Note:* ${leadRecord.note}\n` : "") +
          `📍 *Source:* ${leadRecord.utm_source || "Direct"}\n` +
          `⏱ *Time:* ${leadRecord.createdAt}`;

        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: tgMessage,
            parse_mode: "Markdown",
          }),
        });
      } catch (tgErr: unknown) {
        console.error("Telegram notification error (request preserved):", (tgErr as Error).message);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Unhandled API error in /api/lead:", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "সার্ভারে অপ্রত্যাশিত ত্রুটি ঘটেছে।" },
      { status: 500 }
    );
  }
}
