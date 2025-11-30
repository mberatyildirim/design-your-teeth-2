// Google Sheets API utility fonksiyonları
// Form verilerini Google Sheets'e kaydetmek için

/**
 * Form verilerini Google Sheets'e kaydet
 * @param formData - Kullanıcının doldurduğu form verileri
 * @param styleTitle - Seçilen diş tipi başlığı
 * @param shadeTitle - Seçilen diş rengi başlığı
 */
export async function saveToGoogleSheets(
  formData: {
    name: string;
    email: string;
    phone: string;
    style: string;
    shade: string;
  },
  styleTitle: string,
  shadeTitle: string
): Promise<void> {
  try {
    console.log("🟡 [GoogleSheets] Starting save process...");
    console.log("🟡 [GoogleSheets] Data to save:", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      style: styleTitle,
      shade: shadeTitle,
      timestamp: new Date().toISOString()
    });

    // Google Sheets API endpoint (Vercel serverless function kullanacağız)
    // Frontend'den direkt Google Sheets API'ye erişim güvenlik riski oluşturur
    // Bu yüzden Vercel serverless function kullanacağız
    
    const requestBody = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      style: styleTitle,
      shade: shadeTitle,
      timestamp: new Date().toISOString(),
    };

    console.log("🟡 [GoogleSheets] Request URL: /api/save-to-sheets");
    console.log("🟡 [GoogleSheets] Request body:", JSON.stringify(requestBody, null, 2));

    // Timeout ekle - 10 saniye içinde cevap gelmezse hata ver
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saniye timeout

    const response = await fetch('/api/save-to-sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("🟡 [GoogleSheets] Response status:", response.status);
    console.log("🟡 [GoogleSheets] Response statusText:", response.statusText);
    console.log("🟡 [GoogleSheets] Response headers:", Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log("🟡 [GoogleSheets] Response body:", responseText);

    if (!response.ok) {
      let errorMessage = `Failed to save to Google Sheets: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch {
        errorMessage += ` - ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    console.log("✅ [GoogleSheets] Successfully saved to Google Sheets");
  } catch (error: any) {
    console.error("❌ [GoogleSheets] Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      fullError: error,
      isAbortError: error.name === 'AbortError'
    });
    
    // Timeout veya network hatası durumunda sessizce devam et
    if (error.name === 'AbortError') {
      console.warn("⚠️ [GoogleSheets] Request timeout - continuing without saving");
      return; // Sessizce devam et
    }
    
    // Diğer hatalar için de sessizce devam et (kullanıcı deneyimini bozmamak için)
    // Production'da error tracking servisine log atılabilir
    return; // Hata olsa bile throw etme, sessizce devam et
  }
}

