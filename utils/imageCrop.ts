// Image crop utility - resimleri kare formata çevirmek için

/**
 * Resmi kare formata çevirir (1:1 aspect ratio)
 * @param file - Yüklenecek resim dosyası
 * @param size - Kare boyutu (default: 1024x1024)
 * @returns Cropped image File
 */
export async function cropImageToSquare(
  file: File,
  size: number = 1024
): Promise<File> {
  return new Promise((resolve, reject) => {
    // File'ı image olarak yükle
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Canvas oluştur
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        // Kare boyutunu ayarla
        canvas.width = size;
        canvas.height = size;
        
        // Resmin boyutlarını hesapla (kare içine sığdır)
        const imgAspect = img.width / img.height;
        let drawWidth = size;
        let drawHeight = size;
        let offsetX = 0;
        let offsetY = 0;
        
        if (imgAspect > 1) {
          // Resim yatay (geniş)
          drawHeight = size;
          drawWidth = size * imgAspect;
          offsetX = (size - drawWidth) / 2;
        } else {
          // Resim dikey (uzun) veya kare
          drawWidth = size;
          drawHeight = size / imgAspect;
          offsetY = (size - drawHeight) / 2;
        }
        
        // Beyaz arka plan
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);
        
        // Resmi ortala ve çiz
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Canvas'ı blob'a çevir
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            
            // Yeni File oluştur
            const croppedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.png'), // Extension'ı .png yap
              { type: 'image/png' }
            );
            
            resolve(croppedFile);
          },
          'image/png',
          0.95 // Quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      // Image source'u set et
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      } else {
        reject(new Error('Invalid file data'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // File'ı oku
    reader.readAsDataURL(file);
  });
}

/**
 * Camera'dan fotoğraf çeker ve kare formata çevirir
 * @param size - Kare boyutu (default: 1024x1024)
 * @param cancelText - Cancel buton metni
 * @returns Cropped image File veya null (kullanıcı iptal ederse)
 */
export async function capturePhotoFromCamera(
  size: number = 1024,
  captureText: string = '📷 Capture',
  cancelText: string = '✕ Cancel'
): Promise<File | null> {
  return new Promise((resolve, reject) => {
    // Video element oluştur
    const video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100vw';
    video.style.height = '100vh';
    video.style.objectFit = 'cover';
    video.style.zIndex = '9999';
    video.style.backgroundColor = '#000';
    
    // Canvas oluştur
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    // Kare boyutunu ayarla
    canvas.width = size;
    canvas.height = size;
    
    // Video stream başlat
    navigator.mediaDevices
      .getUserMedia({ 
        video: { 
          facingMode: 'user', // Front camera
          width: { ideal: size },
          height: { ideal: size }
        } 
      })
      .then((stream) => {
        video.srcObject = stream;
        document.body.appendChild(video);
        
        // Capture button oluştur
        const captureBtn = document.createElement('button');
        captureBtn.textContent = captureText;
        captureBtn.style.position = 'fixed';
        captureBtn.style.bottom = '20px';
        captureBtn.style.left = '50%';
        captureBtn.style.transform = 'translateX(-50%)';
        captureBtn.style.zIndex = '10000';
        captureBtn.style.padding = '15px 30px';
        captureBtn.style.fontSize = '18px';
        captureBtn.style.borderRadius = '50px';
        captureBtn.style.border = 'none';
        captureBtn.style.backgroundColor = '#10b981';
        captureBtn.style.color = 'white';
        captureBtn.style.cursor = 'pointer';
        captureBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        
        // Cancel button oluştur
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = cancelText;
        cancelBtn.style.position = 'fixed';
        cancelBtn.style.top = '20px';
        cancelBtn.style.right = '20px';
        cancelBtn.style.zIndex = '10000';
        cancelBtn.style.padding = '10px 20px';
        cancelBtn.style.fontSize = '16px';
        cancelBtn.style.borderRadius = '25px';
        cancelBtn.style.border = 'none';
        cancelBtn.style.backgroundColor = '#ef4444';
        cancelBtn.style.color = 'white';
        cancelBtn.style.cursor = 'pointer';
        
        const cleanup = () => {
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(video);
          document.body.removeChild(captureBtn);
          document.body.removeChild(cancelBtn);
        };
        
        captureBtn.onclick = () => {
          // Video'dan frame yakala
          const videoAspect = video.videoWidth / video.videoHeight;
          let drawWidth = size;
          let drawHeight = size;
          let offsetX = 0;
          let offsetY = 0;
          
          if (videoAspect > 1) {
            // Video yatay
            drawHeight = size;
            drawWidth = size * videoAspect;
            offsetX = (size - drawWidth) / 2;
          } else {
            // Video dikey veya kare
            drawWidth = size;
            drawHeight = size / videoAspect;
            offsetY = (size - drawHeight) / 2;
          }
          
          // Beyaz arka plan
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, size, size);
          
          // Video frame'ini çiz
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
          
          // Canvas'ı blob'a çevir
          canvas.toBlob(
            (blob) => {
              cleanup();
              
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }
              
              const file = new File(
                [blob],
                `photo-${Date.now()}.png`,
                { type: 'image/png' }
              );
              
              resolve(file);
            },
            'image/png',
            0.95
          );
        };
        
        cancelBtn.onclick = () => {
          cleanup();
          resolve(null);
        };
        
        document.body.appendChild(captureBtn);
        document.body.appendChild(cancelBtn);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

