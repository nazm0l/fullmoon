# Full Moon Night, Cox's Bazar: Landing Page Build Plan (for Antigravity)

> **How to use this file:** Place it in the repo root as `PLAN.md`. Tell the agent: "Read PLAN.md fully. Follow the phases in order. Stop at each CHECKPOINT and show me the result before continuing. Do not add features that are not in this plan."

---

## 0. Goal and hard constraints

**Goal:** A very fast, engaging, mobile-first, Bangla-first landing page for a one-night full moon family event at a beach-side restaurant in Cox's Bazar. The only business outcome is **collecting family booking leads**, with a WhatsApp fallback for people who want to ask questions.

**Hard constraints (do not violate):**
1. Stack: **Next.js (App Router) + TypeScript + Tailwind CSS**, deployed on **Vercel**.
2. **No database, no auth, no admin panel, no payments, no CMS.** Leads go to a Google Sheet (and optionally Telegram) through a server-side route.
3. Single page (`/`) plus a thank-you state. No blog, no extra routes except `/api/lead`.
4. **Mobile-first.** Most visitors arrive from Facebook/Instagram ads on mid-range Android phones over 4G. Design and test at 360-390px width first.
5. **Performance budget:** Lighthouse mobile Performance >= 90, LCP < 2.5s, CLS < 0.05, total JS on first load < 120 KB gzipped. Keep client JavaScript minimal.
6. **Language:** Bangla is primary. All visible copy lives in one content file so it can be edited without touching components. English is secondary and optional (a simple toggle is allowed only if it stays cheap).
7. Never expose secrets to the browser. Only `NEXT_PUBLIC_*` variables may be client-visible.

---

## 1. Inputs the owner must provide (use placeholders until given)

Create these as clearly marked `TODO` values in `content/event.ts`. **Do not invent real values.**

| Item | Placeholder |
|---|---|
| Event name (Bangla and English) | `TODO_EVENT_NAME` |
| Event date (the full moon night) and start/end time | `TODO_DATE` (expected to be near 24 Nov 2026; owner to confirm) |
| Venue name and short address | `TODO_VENUE` |
| Price (per family or per person) | `TODO_PRICE` |
| Seat capacity / "seats left" (optional) | `TODO_SEATS` |
| WhatsApp number (international format, no +) | `8801XXXXXXXXX` |
| Meta Pixel ID (optional) | `TODO_PIXEL_ID` |
| Photos/video (hero, food, venue) | `/public/images/*` placeholders |
| Final time-wise schedule | see Section 3 (DRAFT) |

---

## 2. Tech setup

- `npx create-next-app@latest` with: TypeScript, Tailwind, ESLint, App Router, `src/` directory, import alias `@/*`.
- Dependencies: `zod` only (validation). No UI kits, no animation libraries, no form libraries.
- Font: `next/font/google` with **Hind Siliguri** (Bangla + Latin), `display: swap`, weights 400/600/700 only.
- Images: `next/image`, WebP/AVIF, explicit `width`/`height`, hero image uses `priority`; everything else lazy.
- Animations: CSS only (fade-in/translate on scroll via `IntersectionObserver` in one tiny client component, respecting `prefers-reduced-motion`).

### Folder structure

```
src/
  app/
    layout.tsx            // font, metadata, Meta Pixel script (afterInteractive)
    page.tsx              // server component, composes sections
    globals.css
    api/lead/route.ts     // POST handler
    opengraph-image.png   // OG image (1200x630)
  components/
    Hero.tsx
    QuickFacts.tsx
    Timeline.tsx
    Highlights.tsx
    FamilyFriendly.tsx
    BookingForm.tsx       // client component
    Faq.tsx               // native <details>, no JS
    WhatsAppFab.tsx
    Reveal.tsx            // tiny scroll reveal (client)
  content/
    event.ts              // ALL copy, schedule, price, contact
  lib/
    whatsapp.ts           // link builders
    validate.ts           // zod schema + BD phone normalizer
    track.ts              // Meta Pixel helpers
```

---

## 3. Content model (`content/event.ts`)

Everything text-like is defined here. Components only render.

```ts
export const event = {
  nameBn: "TODO_EVENT_NAME",
  nameEn: "Full Moon Night, Cox's Bazar",
  date: "TODO_DATE",
  venue: "TODO_VENUE",
  price: "TODO_PRICE",
  seats: "TODO_SEATS",
  whatsappNumber: "8801XXXXXXXXX",
};

// DRAFT schedule transcribed from the owner's handwritten note.
// The photo was dim; every item MUST be confirmed by the owner before launch.
export const schedule = [
  { time: "TODO", title: "Arrival and welcome drinks", note: "TODO", icon: "welcome" },
  { time: "TODO", title: "Dinner: khichuri, biryani, BBQ, prawn dishes, bhorta", note: "TODO", icon: "dinner" },
  { time: "TODO", title: "Tea and coffee under the moon", note: "TODO", icon: "tea" },
  { time: "TODO", title: "Muri makha and fried prawn snack round", note: "TODO", icon: "snack" },
  { time: "TODO", title: "Late-night snacks (luchi etc.)", note: "TODO", icon: "snack" },
  { time: "TODO", title: "Early-morning tea and coffee", note: "TODO", icon: "tea" },
];
```

Add `faq`, `highlights`, and `familyPoints` arrays in the same file with short placeholder entries.

---

## 4. Page sections (in order)

1. **Hero:** full-bleed moonlit beach image (or a <= 1.5 MB muted looping video with a poster image; the poster must be the LCP element). Headline = event name, subline = date, time, venue. One primary CTA, "বুক করুন" ("Book Now"), that scrolls to `#book`. A secondary text link, "WhatsApp-এ জানুন", opens WhatsApp.
2. **Quick facts strip:** 4 chips: date, time, venue, price (plus "seats left" only if `seats` is set).
3. **Night timeline:** vertical timeline from `schedule`. Each slot: time, title, short note, small inline SVG icon. Slots fade in on scroll. This section is the heart of the page, so give it the best polish.
4. **Highlights:** 4-6 photo cards (food, setting, moonlit beach, kids' fun). Lazy-loaded.
5. **Family-friendly points:** 3-4 short reassurance points (safe seating, kid-friendly food, organised staff, etc.). Text from `familyPoints`.
6. **Booking form** (`id="book"`): see Section 5.
7. **FAQ:** 4-5 native `<details>` items.
8. **Footer:** event name, WhatsApp link, one-line disclaimer.
9. **Floating WhatsApp button** (bottom-right, always visible, does not cover the form's submit button on small screens; add bottom padding on the page).

**Design direction:** dark navy/indigo night palette, warm moon-gold accent (`#F5C84C`-ish), soft glows, generous spacing, large tap targets (>= 48px). Text must meet WCAG AA contrast. Keep it calm and premium, not cluttered.

---

## 5. Booking form spec

**Fields (keep it short; every extra field reduces conversions):**

| Field | Type | Rules |
|---|---|---|
| `name` | text | required, 2-60 chars |
| `phone` | tel | required, Bangladeshi mobile, accepts `01XXXXXXXXX`, `+8801...`, `8801...`, normalised to `01XXXXXXXXX` |
| `adults` | number stepper | required, 1-10, default 2 |
| `children` | number stepper | optional, 0-10, default 0 |
| `note` | textarea | optional, max 300 chars |

Hidden/anti-spam: a honeypot field `company` (must be empty) and a `ts` timestamp (reject if submitted < 3 seconds after page load).

**Behavior:**
- Native `<form>` with `fetch('/api/lead', { method: 'POST' })`; disable the button while submitting; show inline Bangla errors.
- On success: replace the form with a thank-you card: "ধন্যবাদ! আমরা শীঘ্রই WhatsApp-এ কনফার্ম করব।" plus a **"WhatsApp-এ চ্যাট করুন"** button with a prefilled message including the person's name.
- On failure: show a friendly error and a WhatsApp fallback button so the lead is not lost.
- Capture and send: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` (read from `window.location.search` on load), `referrer`, and `page_url`.
- Fire Meta Pixel `Lead` event **only after** a successful API response.

---

## 6. API route (`src/app/api/lead/route.ts`)

`POST /api/lead` (Node runtime):

1. Parse JSON; validate with the Zod schema from `lib/validate.ts`. Return `400` with field errors on failure.
2. If honeypot filled or `ts` too fresh: return `200 { ok: true }` silently (do not tip off bots) and do nothing.
3. Normalise the phone number.
4. Build the lead record:
   `{ createdAt (ISO, Asia/Dhaka), name, phone, adults, children, note, utm_*, referrer, page_url }`
5. `POST` it to `process.env.GOOGLE_SCRIPT_URL` with `secret: process.env.GOOGLE_SCRIPT_SECRET` in the body. Use `AbortController` with a 8s timeout.
6. If `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set, also send a short Telegram message (name, phone, adults/children, note). Telegram failure must **not** fail the request.
7. If the Google Sheet call fails: respond `502 { ok: false }` so the UI shows the WhatsApp fallback. Log the error with `console.error` (never log the secret).
8. Best-effort basic rate limiting (in-memory per IP, e.g. 5 requests per 10 minutes). Note in a code comment that serverless memory is not shared; it is only a light deterrent.

Response: `{ ok: true }` on success.

### Environment variables (Vercel and `.env.local`)

```
GOOGLE_SCRIPT_URL=
GOOGLE_SCRIPT_SECRET=
TELEGRAM_BOT_TOKEN=        # optional
TELEGRAM_CHAT_ID=          # optional
NEXT_PUBLIC_WHATSAPP_NUMBER=8801XXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID= # optional
```

Provide a committed `.env.example` with these keys and empty values. Make sure `.env*` is gitignored.

---

## 7. Google Sheet + Apps Script (lead storage)

Include this as `docs/google-apps-script.gs` in the repo and a `docs/SETUP.md` explaining the steps below.

**Sheet header row (row 1):**
`createdAt | name | phone | adults | children | note | utm_source | utm_medium | utm_campaign | utm_content | referrer | page_url`

**Apps Script code:**

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || data.secret !== secret) {
      return out({ ok: false, error: 'unauthorized' });
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads')
      || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.createdAt, data.name, "'" + data.phone, data.adults, data.children,
      data.note, data.utm_source, data.utm_medium, data.utm_campaign,
      data.utm_content, data.referrer, data.page_url
    ]);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

**Setup steps (document in SETUP.md):**
1. Create a Google Sheet, rename the tab to `Leads`, add the header row.
2. Extensions > Apps Script > paste the code.
3. Project Settings > Script Properties > add `SECRET` = a long random string (same value as `GOOGLE_SCRIPT_SECRET`).
4. Deploy > New deployment > Web app > Execute as: **Me**, Who has access: **Anyone**. Copy the `/exec` URL into `GOOGLE_SCRIPT_URL`.
5. After any code change, create a **new deployment version**.

Note for the agent: Apps Script answers POSTs with a redirect; use `fetch` with `redirect: 'follow'` and send `Content-Type: text/plain;charset=utf-8` with a JSON string body.

---

## 8. WhatsApp links (`lib/whatsapp.ts`)

- Builder: `https://wa.me/${number}?text=${encodeURIComponent(message)}`
- Three message variants (editable in `content/event.ts`):
  1. **General/FAB:** "আমি Full Moon Night ইভেন্ট সম্পর্কে বিস্তারিত জানতে চাই।"
  2. **After booking:** includes the person's name and "আমি বুকিং ফর্ম সাবমিট করেছি।"
  3. **Form failure fallback:** "ফর্ম সাবমিট হয়নি, আমি বুক করতে চাই।"
- All links open with `target="_blank" rel="noopener noreferrer"`.

---

## 9. Tracking and SEO

- **Meta Pixel:** load with `next/script` `strategy="afterInteractive"` only if `NEXT_PUBLIC_META_PIXEL_ID` is set. Fire `PageView` on load and `Lead` on successful submit. Also fire a custom `Contact` event when the WhatsApp button is clicked.
- **Metadata:** Bangla title and description, Open Graph and Twitter card with `opengraph-image`, `lang="bn"` on `<html>`, canonical URL, favicon (moon emoji or SVG).
- Add `robots.ts` and `sitemap.ts` (single URL).
- Do **not** add cookie banners or extra analytics unless requested.

---

## 10. Build phases (follow in order; stop at each CHECKPOINT)

**Phase 1: Scaffold.** Create the project, Tailwind theme (night palette), font, layout, folder structure, `.env.example`. 
**CHECKPOINT 1:** `npm run build` passes; empty page renders with correct font.

**Phase 2: Content and static sections.** `content/event.ts` with placeholders; Hero, QuickFacts, Timeline, Highlights, FamilyFriendly, Faq, Footer, Reveal. Use placeholder gradients or images where assets are missing. 
**CHECKPOINT 2:** Show screenshots at 375px and 1280px. Owner reviews look and copy.

**Phase 3: Form and API.** BookingForm, Zod schema, phone normaliser, `/api/lead`, honeypot, timing check, UTM capture, thank-you state, WhatsApp fallback. Allow a `MOCK_LEADS=true` env mode that logs leads to the console instead of calling Google (for local testing). 
**CHECKPOINT 3:** Submit valid and invalid forms locally; show results.

**Phase 4: Integrations.** Real Google Apps Script connection, optional Telegram, WhatsApp links, Meta Pixel events. Write `docs/SETUP.md` and `docs/google-apps-script.gs`. 
**CHECKPOINT 4:** A test lead appears in the Sheet (and Telegram if configured).

**Phase 5: Performance and polish.** Compress images, check CLS, run Lighthouse mobile, fix issues, verify reduced-motion behavior, check keyboard and screen-reader basics. 
**CHECKPOINT 5:** Report Lighthouse scores and JS bundle size.

**Phase 6: Deploy.** Push to GitHub, import to Vercel, add env vars, deploy to production, attach custom domain. Run the acceptance tests below on the live URL.

---

## 11. Acceptance criteria (all must pass)

- [ ] Page loads and looks right at 360px, 390px, 768px, and 1280px width.
- [ ] Lighthouse mobile: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95.
- [ ] First-load JS < 120 KB gzipped; hero image is the LCP element and loads in < 2.5s on simulated 4G.
- [ ] Valid submission creates exactly one row in the Sheet, shows the thank-you card, and fires the Pixel `Lead` event.
- [ ] Invalid inputs (short name, bad phone, 0 adults) show clear Bangla errors and send nothing.
- [ ] Filling the honeypot or submitting instantly creates no row.
- [ ] If Google is unreachable, the user sees the WhatsApp fallback and no crash occurs.
- [ ] Phone numbers entered as `+8801712345678`, `8801712345678`, and `01712345678` all store as `01712345678`.
- [ ] Every WhatsApp button opens a chat with the correct number and prefilled message.
- [ ] No secrets appear in client bundles, git history, or the browser network tab.
- [ ] No placeholder `TODO` text is visible on the final production page.

---

## 12. Do not do

- Do not add a database, ORM, auth, admin dashboard, payment gateway, or email service.
- Do not add UI component libraries, animation libraries, or heavy video backgrounds.
- Do not invent prices, dates, venue details, or claims. Use the owner's content only.
- Do not collect more personal data than the fields listed above.
- Do not add extra pages or routes.
- Do not commit `.env` files or the Apps Script secret.

