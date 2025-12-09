// Geolocation utility - User'ın konumuna göre telefon ülke kodu çekme

// Ülke kodları mapping
const COUNTRY_TO_CODE: { [key: string]: string } = {
  'US': '+1',
  'GB': '+44',
  'TR': '+90',
  'DE': '+49',
  'FR': '+33',
  'CA': '+1',
  'AU': '+61',
  'IT': '+39',
  'ES': '+34',
  'NL': '+31',
  'BE': '+32',
  'CH': '+41',
  'AT': '+43',
  'SE': '+46',
  'NO': '+47',
  'DK': '+45',
  'FI': '+358',
  'PL': '+48',
  'CZ': '+420',
  'GR': '+30',
  'PT': '+351',
  'IE': '+353',
  'NZ': '+64',
  'ZA': '+27',
  'BR': '+55',
  'MX': '+52',
  'AR': '+54',
  'CL': '+56',
  'CO': '+57',
  'PE': '+51',
  'IN': '+91',
  'CN': '+86',
  'JP': '+81',
  'KR': '+82',
  'SG': '+65',
  'MY': '+60',
  'TH': '+66',
  'ID': '+62',
  'PH': '+63',
  'VN': '+84',
  'AE': '+971',
  'SA': '+966',
  'IL': '+972',
  'EG': '+20',
  'RU': '+7',
};

// Default country code
const DEFAULT_CODE = '+1';

/**
 * User'ın konumuna göre telefon ülke kodunu çek
 * Geolocation API veya IP-based geolocation kullanır
 */
export async function getUserCountryCode(): Promise<string> {
  try {
    // Önce localStorage'dan kontrol et (cache)
    const cached = localStorage.getItem('user_country_code');
    if (cached) {
      return cached;
    }

    // IP-based geolocation API kullan (ücretsiz ve permission gerektirmez)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.country_code && COUNTRY_TO_CODE[data.country_code]) {
      const code = COUNTRY_TO_CODE[data.country_code];
      // Cache'e kaydet
      localStorage.setItem('user_country_code', code);
      return code;
    }
    
    // Fallback: default code
    return DEFAULT_CODE;
  } catch (error) {
    console.error('❌ [Geolocation] Failed to get country code:', error);
    return DEFAULT_CODE;
  }
}

