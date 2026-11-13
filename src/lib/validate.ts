import { z } from "zod";

/**
 * Normalises Bangladeshi phone number to 01XXXXXXXXX format (11 digits).
 * Handles +8801..., 8801..., 01..., spaces, dashes.
 */
export function normalizeBdPhone(input: string): string {
  // Remove all non-digit characters except leading plus
  let cleaned = input.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+880")) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith("880")) {
    cleaned = cleaned.substring(2);
  }

  // If it starts with 1 and is 10 digits, prepend 0
  if (cleaned.startsWith("1") && cleaned.length === 10) {
    cleaned = "0" + cleaned;
  }

  return cleaned;
}

/**
 * Validates whether string is a valid Bangladeshi mobile number
 * Operators: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits
 */
export function isValidBdPhone(phone: string): boolean {
  const normalized = normalizeBdPhone(phone);
  return /^01[3-9]\d{8}$/.test(normalized);
}

export const leadFormSchema = z.object({
  name: z
    .string({
      error: "অনুগ্রহ করে আপনার নাম লিখুন",
    })
    .trim()
    .min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে")
    .max(60, "নাম সর্বোচ্চ ৬০ অক্ষরের হতে পারে"),
  phone: z
    .string({
      error: "সচল মোবাইল নম্বর প্রদান করুন",
    })
    .trim()
    .refine((val) => isValidBdPhone(val), {
      message: "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)",
    }),
  persons: z
    .coerce
    .number({
      error: "সদস্য সংখ্যা উল্লেখ করুন",
    })
    .int("পূর্ণ সংখ্যা লিখুন")
    .min(1, "কমপক্ষে ১ জন হতে হবে")
    .max(20, "একবারে সর্বোচ্চ ২০ জনের বুকিং সম্ভব")
    .default(1),
  paymentMethod: z
    .enum(["bkash", "bank"])
    .default("bkash"),
  transactionId: z
    .string({
      error: "পেমেন্ট ট্রানজেকশন আইডি / রেফারেন্স নম্বর দিন",
    })
    .trim()
    .min(3, "সঠিক TrxID বা ব্যাংক রেফারেন্স নম্বর দিন")
    .max(50, "TrxID বা রেফারেন্স নম্বর সর্বোচ্চ ৫০ অক্ষরের হতে পারে"),
  note: z
    .string()
    .max(300, "বিশেষ নোট সর্বোচ্চ ৩০০ অক্ষরের মধ্যে লিখুন")
    .optional()
    .default(""),
  // Anti-spam fields
  company: z.string().optional().default(""), // Honeypot (must be empty)
  ts: z.coerce.number().optional(), // Timestamp when form rendered
  // Attribution & analytics
  utm_source: z.string().optional().default(""),
  utm_medium: z.string().optional().default(""),
  utm_campaign: z.string().optional().default(""),
  utm_content: z.string().optional().default(""),
  referrer: z.string().optional().default(""),
  page_url: z.string().optional().default(""),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

