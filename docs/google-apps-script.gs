/**
 * Full Moon Night, Cox's Bazar - Google Apps Script Lead Webhook
 * 
 * Instructions:
 * 1. Open Google Sheet, rename first tab to "Leads".
 * 2. Add header row in Row 1:
 *    createdAt | name | phone | persons | totalAmount | paymentMethod | transactionId | note | utm_source | utm_medium | utm_campaign | utm_content | referrer | page_url
 * 3. Extensions > Apps Script > Paste this script.
 * 4. Project Settings > Script Properties > Add Property:
 *    Key: SECRET
 *    Value: <YOUR_LONG_RANDOM_SECRET_STRING>
 * 5. Deploy > New deployment > Type: Web app
 *    - Description: Production Lead Receiver
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy Web App URL into GOOGLE_SCRIPT_URL in .env.local / Vercel.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    
    if (!secret || data.secret !== secret) {
      return out({ ok: false, error: 'unauthorized' });
    }
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads')
      || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      
    // Prepend single quote to phone so Google Sheets preserves leading zero (e.g. 017...)
    sheet.appendRow([
      data.createdAt,
      data.name,
      "'" + data.phone,
      data.persons || data.adults || 1,
      data.totalAmount || "",
      data.paymentMethod || "bKash",
      data.transactionId || "",
      data.note,
      data.utm_source,
      data.utm_medium,
      data.utm_campaign,
      data.utm_content,
      data.referrer,
      data.page_url
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

