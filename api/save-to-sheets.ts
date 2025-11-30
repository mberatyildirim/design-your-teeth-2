// Vercel Serverless Function - Google Sheets'e veri kaydetme
// Bu dosya Vercel'de otomatik olarak serverless function olarak çalışır

import { google } from 'googleapis';

// Request ve Response tipleri
interface RequestBody {
  name: string;
  email: string;
  phone: string;
  style: string;
  shade: string;
  timestamp: string;
}

// Google Sheets API client oluştur
function getGoogleSheetsClient() {
  // Environment variables'dan credentials al
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error('Google Sheets credentials not configured');
  }

  // JWT client oluştur
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Ana handler fonksiyonu - Vercel serverless function formatı
export default async function handler(req: any, res: any) {
  console.log("🟡 [Serverless] Request received:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });

  // Sadece POST isteklerine izin ver
  if (req.method !== 'POST') {
    console.log("❌ [Serverless] Method not allowed:", req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body: RequestBody = req.body;
    console.log("🟡 [Serverless] Request body:", JSON.stringify(body, null, 2));

    // Gerekli alanları kontrol et
    if (!body.name || !body.email || !body.phone) {
      console.error("❌ [Serverless] Missing required fields:", {
        hasName: !!body.name,
        hasEmail: !!body.email,
        hasPhone: !!body.phone
      });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log("🟡 [Serverless] Getting Google Sheets client...");
    // Google Sheets client'ı al
    const sheets = getGoogleSheetsClient();
    console.log("✅ [Serverless] Google Sheets client created");

    // Spreadsheet ID - environment variable'dan al veya default kullan
    // Not: Gerçek spreadsheet ID'yi Vercel environment variables'a eklemeniz gerekiyor
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || 'YOUR_SPREADSHEET_ID';
    console.log("🟡 [Serverless] Using spreadsheet ID:", spreadsheetId);

    if (spreadsheetId === 'YOUR_SPREADSHEET_ID') {
      console.error("❌ [Serverless] Spreadsheet ID not configured");
      return res.status(500).json({ 
        error: 'Spreadsheet ID not configured',
        message: 'Please set GOOGLE_SPREADSHEET_ID environment variable'
      });
    }

    // Veriyi ekle - A sütunundan başlayarak
    const range = 'Sheet1!A:F'; // A'dan F'ye kadar sütunlar
    const values = [[
      body.timestamp,
      body.name,
      body.email,
      body.phone,
      body.style,
      body.shade,
    ]];

    console.log("🟡 [Serverless] Appending values to sheet:", {
      range,
      values
    });

    // Sheets'e append işlemi
    const appendResult = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log("✅ [Serverless] Successfully appended to sheet:", appendResult.data);

    // Başarılı yanıt döndür
    return res.status(200).json({ success: true, data: appendResult.data });
  } catch (error: any) {
    console.error("❌ [Serverless] Google Sheets API Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
      response: error.response?.data,
      fullError: error
    });
    return res.status(500).json({ 
      error: 'Failed to save to Google Sheets',
      message: error.message,
      details: error.response?.data || error.stack
    });
  }
}

