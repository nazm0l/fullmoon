# Full Moon Night, Cox's Bazar: Setup & Integration Guide

This guide walks you through connecting your landing page to Google Sheets (for lead collection), Telegram notifications (optional instant alerts), Meta Pixel tracking, and WhatsApp.

---

## 1. Google Sheets Lead Storage (Apps Script)

The landing page forwards all verified family booking leads from `/api/lead` directly to a private Google Sheet using Google Apps Script.

### Step 1: Create the Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new spreadsheet.
2. Name the spreadsheet: `Full Moon Night Leads`.
3. Rename the first tab at the bottom to `Leads`.
4. In **Row 1**, paste this exact 12-column header:
   ```
   createdAt | name | phone | adults | children | note | utm_source | utm_medium | utm_campaign | utm_content | referrer | page_url
   ```
   *(Bold row 1 and freeze it via View > Freeze > 1 row for clean viewing).*

### Step 2: Add the Apps Script Code
1. In the Google Sheet top menu, go to **Extensions > Apps Script**.
2. Replace all existing text with the contents of `docs/google-apps-script.gs` in this repository.
3. Click the **Save** icon (diskette).

### Step 3: Configure Secret Key
1. In the Apps Script left sidebar, click the **Gear icon (Project Settings)**.
2. Scroll to **Script Properties** and click **Add script property**:
   - **Property:** `SECRET`
   - **Value:** Generate a random string (e.g. `moon_secret_98a72b8c9d10e`)
3. Click **Save script properties**.
4. Note down this exact secret value — you will need it for `GOOGLE_SCRIPT_SECRET`.

### Step 4: Deploy as a Web App
1. At the top right of Apps Script, click **Deploy > New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the settings:
   - **Description:** `Lead Webhook v1`
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone` *(Crucial: allows server-to-server POSTs without OAuth prompts)*
4. Click **Deploy**.
5. When prompted, click **Authorize Access** and select your Google account. (If you see "Google hasn't verified this app", click *Advanced* > *Go to Untitled project (unsafe)*).
6. Copy the **Web app URL** (ends in `/exec`).

### Step 5: Add to Environment Variables
In your `.env.local` (local) and Vercel Project Settings (production):
```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbx.../exec
GOOGLE_SCRIPT_SECRET=moon_secret_98a72b8c9d10e
MOCK_LEADS=false
```

> **Note on Updates:** If you ever edit the Apps Script code, you must create a **New version** under Deploy > Manage deployments, otherwise the live webhook will continue running the old code.

---

## 2. Optional: Instant Telegram Alerts

Receive an instant notification on your phone whenever a family books.

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot`, choose a name and username (e.g. `CoxsBazarFullMoonBot`).
3. BotFather will provide an API Token (e.g. `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`).
4. Start a chat with your new bot and send any message (e.g. "hi").
5. To get your Chat ID:
   - Forward any message to `@userinfobot` or `@RawDataBot`, which will display your numeric `Id` (e.g. `987654321`).
   - If using a Telegram Group, add the bot to the group, send a message, and obtain the group chat ID (starts with `-100...`).
6. Set the environment variables:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
   TELEGRAM_CHAT_ID=987654321
   ```

*Note: If Telegram is unreachable, lead storage to Google Sheets will still succeed.*

---

## 3. WhatsApp Configuration

Set your official business WhatsApp number in international format (no `+`, no spaces, no dashes):
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=88017XXXXXXXX
```

Links generated across the site:
1. **Header / FAB link:** General event inquiries.
2. **Thank-you state link:** Auto-fills: *"হ্যালো, আমি বুকিং ফর্ম সাবমিট করেছি। আমার নাম [নাম]। আসন নিশ্চিতকরণের বিষয়ে জানতে চাই।"*
3. **Fallback link:** If the user encounters connection issues: *"ফর্ম সাবমিট হয়নি, আমি বুক করতে চাই।"*

---

## 4. Meta Pixel (Facebook & Instagram Ads)

The page includes native Meta Pixel tracking:
1. Set your Pixel ID in `.env.local` or Vercel:
   ```env
   NEXT_PUBLIC_META_PIXEL_ID=1234567890123456
   ```
2. Automatically tracked events:
   - `PageView`: Fired on page visit.
   - `Lead`: Fired **only** after a successful `/api/lead` submission response.
   - `Contact`: Fired when a visitor taps the floating WhatsApp button.

---

## 5. Local Testing vs. Production

### Mock Mode (Default for Local Development)
When `MOCK_LEADS=true` or when `GOOGLE_SCRIPT_URL` is empty, leads are not sent to Google Sheets. Instead, they are validated and printed cleanly to your terminal console:
```bash
MOCK_LEADS=true
```

### Live Test Mode
Set `MOCK_LEADS=false` and provide your real `GOOGLE_SCRIPT_URL` and `GOOGLE_SCRIPT_SECRET`. Submitting the form will append a row in your Google Sheet immediately.

---

## 6. Environment Variables Checklist

| Variable | Description | Required | Client-Visible? |
|---|---|---|---|
| `GOOGLE_SCRIPT_URL` | Apps Script `/exec` URL | Yes (for live leads) | No (Secret) |
| `GOOGLE_SCRIPT_SECRET` | Secret token matching Script Properties | Yes (for live leads) | No (Secret) |
| `TELEGRAM_BOT_TOKEN` | Bot API token from BotFather | Optional | No (Secret) |
| `TELEGRAM_CHAT_ID` | Telegram user or group ID | Optional | No (Secret) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Official WhatsApp number (e.g. `88017...`) | Yes | Yes (`NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID | Optional | Yes (`NEXT_PUBLIC_`) |
| `MOCK_LEADS` | Set to `true` to test locally without Google | Local dev | No (Server only) |

