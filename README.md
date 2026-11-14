# Full Moon, Sea & Seafood Night — Landing Page

> **জোছনা মাখা সমুদ্র, মুগ্ধতার এক রাত**  
> Event Date: 24 November 2026 | Venue: Coastal Heaven, Cox's Bazar | Presented by: Remark

A high-converting, mobile-first, Bangla-first event booking landing page built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Key Features

- **Theme & Design:** Immersive living full moon ambient night sky background with starlight twinkle and ocean shimmer. Styled directly based on official event posters.
- **Mobile-First UX:** Streamlined, tight vertical spacing tuned for 360-390px mobile screens.
- **Dynamic Pricing & Calculation:** Highlights the 40% discount (5,880 TK vs 9,800 TK) with instant dynamic total calculation based on person count.
- **Mobile Banking Integration:** bKash / Nagad / Rocket send money instructions with one-click copy button and required transaction ID (`TrxID`) collection.
- **Icons:** Powered entirely by `lucide-react` icons.
- **Zero Database / Zero CMS:** Server-side lead route (`/api/lead`) forwards bookings directly to Google Sheets via Google Apps Script and optional Telegram bot notifications.
- **Anti-Spam & Performance:** Honeypot field, submission timing checks, rate limiting, and 100% static page prerendering with under 120 KB gzipped client bundle.

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Variables

Create `.env.local` based on `.env.example`:

```bash
cp .env.example .env.local
```

Configure:
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Organizer WhatsApp number (e.g. `8801816856022`)
- `GOOGLE_SCRIPT_URL`: Google Apps Script Web App URL (for Google Sheets storage)
- `GOOGLE_SCRIPT_SECRET`: Shared webhook secret
- `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID`: (Optional) Instant Telegram notifications
- `MOCK_LEADS=true`: Logs submissions to console during local development

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view.

### 4. Production Build

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/lead/route.ts     # Lead submission API handler with Zod validation
│   ├── globals.css           # Custom animations, lunar glows, glassmorphism
│   ├── layout.tsx            # Hind Siliguri & Playfair fonts, SEO metadata
│   ├── page.tsx              # Single-page layout composition
│   ├── robots.ts & sitemap.ts
├── components/
│   ├── FullMoonBackground.tsx# Living full moon and starry sky background
│   ├── Navbar.tsx            # Sticky header with discount ribbon
│   ├── Hero.tsx              # Official poster recreation, price badge & CTA
│   ├── CoreExperience.tsx    # 5 highlights cards with 10-item dinner menu
│   ├── Timeline.tsx          # 11 PM to 5 AM event schedule
│   ├── BookingForm.tsx       # Dynamic lead & payment booking form
│   ├── Footer.tsx            # Contact details, organizer info & disclaimer
│   ├── WhatsAppFab.tsx       # Floating WhatsApp button
│   └── Reveal.tsx            # Smooth CSS scroll reveal
├── content/
│   └── event.ts              # Single source of truth for all copy & pricing
└── lib/
    ├── track.ts              # Meta Pixel helper
    ├── validate.ts           # Zod schema & BD phone normalization
    └── whatsapp.ts           # WhatsApp link generator
```

---

## 📄 License

Proprietary © 2026 Remark. All rights reserved.
