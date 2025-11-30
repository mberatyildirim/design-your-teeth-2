// Fal AI API utility fonksiyonları
// Nano Banana Pro model ile image editing işlemleri için

import { fal } from "@fal-ai/client";

// Fal AI client'ını yapılandır - API key'i environment variable'dan al
// Vercel'de VITE_ prefix ile environment variable'lar frontend'de erişilebilir
fal.config({
  credentials: import.meta.env.VITE_FAL_AI_KEY || "38b6f94d-9181-45f9-8a00-055ebd236c7b:995ce5373d76acf874023354e6c4ab46"
});

/**
 * Image editing işlemi - Nano Banana Pro model kullanarak
 * @param userImage - Kullanıcının yüklediği resim (File veya URL)
 * @param styleImage - Kullanıcının seçtiği diş tipi resmi (URL)
 * @param shadeHex - Kullanıcının seçtiği diş rengi hex kodu
 * @returns Edited image URL
 */
export async function editImageWithAI(
  userImage: File | string,
  styleImage: string,
  shadeHex: string
): Promise<string> {
  try {
    console.log("🔵 [FalAI] Starting image editing process...");
    console.log("🔵 [FalAI] User image type:", userImage instanceof File ? "File" : "URL");
    console.log("🔵 [FalAI] Style image path:", styleImage);
    console.log("🔵 [FalAI] Shade hex:", shadeHex);

    // Kullanıcı resmini URL'ye çevir (eğer File ise)
    let userImageUrl: string;
    if (userImage instanceof File) {
      console.log("🔵 [FalAI] Uploading user image to Fal AI storage...");
      console.log("🔵 [FalAI] File name:", userImage.name);
      console.log("🔵 [FalAI] File size:", userImage.size, "bytes");
      console.log("🔵 [FalAI] File type:", userImage.type);
      
      // File'ı Fal AI storage'a yükle
      userImageUrl = await fal.storage.upload(userImage);
      console.log("✅ [FalAI] User image uploaded. URL:", userImageUrl);
    } else {
      userImageUrl = userImage;
      console.log("🔵 [FalAI] Using provided user image URL:", userImageUrl);
    }

    // Style image'ı da yükle (eğer File ise)
    let styleImageUrl: string;
    if (styleImage.startsWith('http') || styleImage.startsWith('https')) {
      styleImageUrl = styleImage;
      console.log("🔵 [FalAI] Using provided style image URL:", styleImageUrl);
    } else if (styleImage.startsWith('data:')) {
      // Data URL ise direkt kullan
      styleImageUrl = styleImage;
      console.log("🔵 [FalAI] Using data URL for style image");
    } else {
      // Local path ise, public folder'dan eriş - path'i düzelt
      // '/tooth-types/natural.jpg' formatında olmalı
      const cleanPath = styleImage.replace('../public//', '/').replace('//', '/');
      
      // Eğer hala local path ise, absolute URL'ye çevir
      if (!cleanPath.startsWith('http')) {
        // Development'ta localhost, production'da domain
        const baseUrl = window.location.origin;
        styleImageUrl = `${baseUrl}${cleanPath}`;
        console.log("🔵 [FalAI] Converted local path to absolute URL:", styleImageUrl);
      } else {
        styleImageUrl = cleanPath;
      }
      
      // Local image'ı da Fal AI storage'a yükle (çünkü API public URL bekliyor)
      try {
        console.log("🔵 [FalAI] Fetching style image to upload to Fal AI storage...");
        const response = await fetch(styleImageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch style image: ${response.status}`);
        }
        const blob = await response.blob();
        const styleFile = new File([blob], 'style-image.jpg', { type: blob.type });
        styleImageUrl = await fal.storage.upload(styleFile);
        console.log("✅ [FalAI] Style image uploaded. URL:", styleImageUrl);
      } catch (fetchError) {
        console.error("❌ [FalAI] Failed to upload style image, using direct URL:", fetchError);
        // Hata durumunda direkt URL'yi kullanmayı dene
      }
    }

    // Prompt oluştur - SADECE İLK RESMİ EDİT ET, ikinci resim sadece stil referansı
    // ÖNEMLİ: Output'ta SADECE ilk image'ın edit edilmiş hali olmalı, ikinci image output'a karışmamalı
    const prompt = `Edit ONLY the FIRST image. Transform the person's teeth in the FIRST image to match the aesthetic style shown in the SECOND image (use it only as a style reference, do not include it in the output). Apply tooth shade color ${shadeHex} to the person's teeth in the FIRST image. Make the teeth look healthy, perfectly aligned, and aesthetically pleasing while maintaining the person's EXACT facial features, identity, and the original photo composition. The output must be ONLY the edited version of the FIRST image, nothing else. Keep the same person, same face, same background, same everything - only improve the teeth.`;
    
    console.log("🔵 [FalAI] Generated prompt:", prompt);
    console.log("🔵 [FalAI] Image order - FIRST (MAIN - will be edited and returned):", userImageUrl);
    console.log("🔵 [FalAI] Image order - SECOND (REFERENCE ONLY - not in output):", styleImageUrl);

    // Fal AI API'ye istek gönder
    console.log("🔵 [FalAI] Sending request to Fal AI API...");
    
    // API parametrelerini hazırla - ÖNEMLİ: İlk image ana image (kullanıcının yüklediği), ikinci image style reference
    // image_urls array'inde sıralama çok önemli: [ana_image, reference_image]
    const imageUrlsArray = [userImageUrl, styleImageUrl].filter(url => url && typeof url === 'string');
    
    console.log("🔵 [FalAI] Image URLs array (order matters!):", imageUrlsArray);
    console.log("🔵 [FalAI] - Index 0 (MAIN IMAGE - will be edited):", imageUrlsArray[0]);
    console.log("🔵 [FalAI] - Index 1 (REFERENCE IMAGE - style only):", imageUrlsArray[1]);
    console.log("🔵 [FalAI] Image URLs count:", imageUrlsArray.length);
    
    // En az 2 image olmalı (ana + reference)
    if (imageUrlsArray.length < 2) {
      throw new Error(`Need at least 2 images: main image and style reference. Got ${imageUrlsArray.length} images.`);
    }
    
    // Her URL'in geçerli olduğunu kontrol et
    for (let i = 0; i < imageUrlsArray.length; i++) {
      const url = imageUrlsArray[i];
      if (!url || (typeof url !== 'string')) {
        throw new Error(`Invalid image URL at index ${i}: ${url}`);
      }
      if (!url.startsWith('http') && !url.startsWith('https') && !url.startsWith('data:')) {
        throw new Error(`Image URL must be a valid HTTP/HTTPS URL or data URI: ${url}`);
      }
    }
    
    const requestInput = {
      prompt: prompt,
      image_urls: imageUrlsArray,
      num_images: 1,
      aspect_ratio: "1:1" as const, // Kare output için
      output_format: "png" as const,
      resolution: "1K" as const
    };
    
    console.log("🔵 [FalAI] Request input:", JSON.stringify({
      ...requestInput,
      image_urls: imageUrlsArray // Log'da array'i göster
    }, null, 2));

    const result = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
      input: requestInput,
      logs: true,
      onQueueUpdate: (update) => {
        console.log("🔵 [FalAI] Queue update:", update.status);
        if (update.status === "IN_PROGRESS") {
          const messages = update.logs?.map((log) => log.message) || [];
          console.log("🔵 [FalAI] Processing logs:", messages);
        }
      },
    });

    console.log("✅ [FalAI] API response received:", result);

    // Sonuç image URL'ini döndür
    if (result.data?.images && result.data.images.length > 0) {
      const imageUrl = result.data.images[0].url;
      console.log("✅ [FalAI] Success! Image URL:", imageUrl);
      return imageUrl;
    }

    console.error("❌ [FalAI] No image in response:", result);
    throw new Error("No image returned from AI");
  } catch (error: any) {
    console.error("❌ [FalAI] Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      response: error.response,
      status: error.status,
      statusText: error.statusText,
      data: error.data,
      fullError: error
    });
    throw error;
  }
}

