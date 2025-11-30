// Local development için Express server
// Google Sheets API endpoint'lerini handle etmek için

import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import dotenv from 'dotenv';

// Environment variables'ı yükle
// dotenv.config() otomatik olarak process.cwd()'den .env dosyasını okur
dotenv.config();

const app = express();
const PORT = 3001;

// CORS ve JSON middleware
app.use(cors());
app.use(express.json());

// Google Sheets API client oluştur
function getGoogleSheetsClient() {
  // Environment variables'dan credentials al
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  console.log("🟡 [Server] Checking credentials...");
  console.log("🟡 [Server] Has private key:", !!privateKey);
  console.log("🟡 [Server] Has client email:", !!clientEmail);

  if (!privateKey || !clientEmail) {
    throw new Error('Google Sheets credentials not configured. Please check your .env file.');
  }

  // JWT client oluştur
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Google Sheets'e kayıt endpoint'i
app.post('/api/save-to-sheets', async (req, res) => {
  console.log("🟡 [Server] POST /api/save-to-sheets - Request received");
  console.log("🟡 [Server] Request body:", JSON.stringify(req.body, null, 2));

  try {
    const body = req.body;

    // Gerekli alanları kontrol et
    if (!body.name || !body.email || !body.phone) {
      console.error("❌ [Server] Missing required fields:", {
        hasName: !!body.name,
        hasEmail: !!body.email,
        hasPhone: !!body.phone
      });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log("🟡 [Server] Getting Google Sheets client...");
    const sheets = getGoogleSheetsClient();
    console.log("✅ [Server] Google Sheets client created");

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || 'YOUR_SPREADSHEET_ID';
    console.log("🟡 [Server] Using spreadsheet ID:", spreadsheetId);

    if (spreadsheetId === 'YOUR_SPREADSHEET_ID') {
      console.error("❌ [Server] Spreadsheet ID not configured");
      return res.status(500).json({ 
        error: 'Spreadsheet ID not configured',
        message: 'Please set GOOGLE_SPREADSHEET_ID environment variable in your .env file'
      });
    }

    const range = 'Sheet1!A:F';
    const values = [[
      body.timestamp,
      body.name,
      body.email,
      body.phone,
      body.style,
      body.shade,
    ]];

    console.log("🟡 [Server] Appending values to sheet:", {
      range,
      values: values[0]
    });

    const appendResult = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log("✅ [Server] Successfully appended to sheet");
    console.log("✅ [Server] Response:", appendResult.data);
    
    return res.status(200).json({ success: true, data: appendResult.data });
  } catch (error: any) {
    console.error("❌ [Server] Error details:", {
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
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 [Server] Express server running on http://localhost:${PORT}`);
  console.log(`🚀 [Server] API endpoint: http://localhost:${PORT}/api/save-to-sheets`);
  console.log(`🚀 [Server] Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n📝 [Server] Environment check:`);
  console.log(`   - GOOGLE_SERVICE_ACCOUNT_EMAIL: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - GOOGLE_PRIVATE_KEY: ${process.env.GOOGLE_PRIVATE_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - GOOGLE_SPREADSHEET_ID: ${process.env.GOOGLE_SPREADSHEET_ID && process.env.GOOGLE_SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID' ? '✅ Set' : '❌ Missing'}`);
  console.log(`\n💡 [Server] Make sure you have a .env file in the project root with these variables!\n`);
});

