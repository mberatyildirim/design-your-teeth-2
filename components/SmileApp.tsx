
import React, { useState, useEffect } from 'react';
import { AppStep, FormData, ShadeOption } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Check, UploadCloud, User, Phone, Loader2, ChevronRight, ChevronLeft, ArrowRight, Camera, Sparkles, Zap } from 'lucide-react';
import { editImageWithAI } from '../utils/falAI';
import { saveSubmissionToSupabase } from '../utils/supabase';
import { cropImageToSquare, capturePhotoFromCamera } from '../utils/imageCrop';

interface SmileAppProps {
  step: AppStep;
  setStep: (step: AppStep) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onReset: () => void;
}

// Optimized Styles - Vite'da public folder'daki dosyalara / ile erişilir
const STYLES = [
  { 
    id: 'natural', 
    title: 'Natural', 
    image: '/tooth-types/natural.jpg' 
  },
  { 
    id: 'hollywood', 
    title: 'Hollywood', 
    image: '/tooth-types/hollywood.jpg' 
  },
  { 
    id: 'oval', 
    title: 'Oval', 
    image: '/tooth-types/oval.jpg' 
  },
  { 
    id: 'dominant', 
    title: 'Dominant', 
    image: '/tooth-types/dominant.jpg' 
  },
];

const SHADES: ShadeOption[] = [
  { id: 'bl1', title: 'Extra White (BL1)', hex: '#FFFFFF' },
  { id: 'bl3', title: 'Bright White (BL3)', hex: '#F4F6F4' },
  { id: 'a1', title: 'Natural (A1)', hex: '#EEEEE2' },
];

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+90', flag: '🇹🇷' },
  { code: '+49', flag: '🇩🇪' },
  { code: '+33', flag: '🇫🇷' },
];

export const SmileApp: React.FC<SmileAppProps> = ({ step, setStep, formData, setFormData, onReset }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [countryCode, setCountryCode] = useState('+1');
  const [showFormPopup, setShowFormPopup] = useState(false); // Form popup state
  const [phoneError, setPhoneError] = useState<string>(''); // Telefon format hatası
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null); // Seçilen style ID (animation için)
  const [selectedShadeId, setSelectedShadeId] = useState<string | null>(null); // Seçilen shade ID (animation için)
  
  // AI işlemi sonuçları için state'ler
  const [resultAfter, setResultAfter] = useState<string | null>(null); // AI'dan gelen after image URL
  const [resultBefore, setResultBefore] = useState<string | null>(null); // Kullanıcının yüklediği original image URL
  const [aiError, setAiError] = useState<string | null>(null); // AI işlemi hata mesajı 

  const handleNext = () => {
    if (step < 5) setStep((step + 1) as AppStep);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as AppStep);
  };

  // Auto-trigger AI submission when step 4 is reached
  useEffect(() => {
    if (step === 4 && !isProcessing && formData.image && formData.style && formData.shade) {
      // Step 4'e gelince direkt AI submission'ı başlat
      const fakeEvent = {
        preventDefault: () => {},
      } as React.FormEvent;
      handleLeadSubmit(fakeEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadProgress(10);
      
      try {
        // Resmi kare formata çevir
        console.log("🟢 [SmileApp] Cropping image to square...");
        const croppedFile = await cropImageToSquare(file, 1024);
        setUploadProgress(50);
        
        setFormData(prev => ({ ...prev, image: croppedFile }));
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploadProgress(0);
          handleNext();
        }, 500);
      } catch (error) {
        console.error("❌ [SmileApp] Image crop error:", error);
        setUploadProgress(0);
        alert('Failed to process image. Please try again.');
      }
    }
  };

  const handleCameraCapture = async () => {
    try {
      setUploadProgress(10);
      console.log("🟢 [SmileApp] Opening camera...");
      
      const file = await capturePhotoFromCamera(1024);
      
      if (file) {
        setUploadProgress(50);
      setFormData(prev => ({ ...prev, image: file }));
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploadProgress(0);
          handleNext();
        }, 500);
      } else {
        // User cancelled
        setUploadProgress(0);
      }
    } catch (error: any) {
      console.error("❌ [SmileApp] Camera error:", error);
      setUploadProgress(0);
      alert(error.message || 'Failed to access camera. Please check permissions.');
    }
  };

  // Telefon format kontrolü - sadece rakamlar ve +, boşluk, tire, parantez kabul eder
  const validatePhoneFormat = (phone: string): boolean => {
    // Telefon numarası sadece rakamlar, boşluk, tire, parantez içerebilir
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    // En az 7 rakam içermeli
    const digitCount = phone.replace(/\D/g, '').length;
    return phoneRegex.test(phone) && digitCount >= 7;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Telefon format kontrolü
    if (!validatePhoneFormat(formData.phone)) {
      setPhoneError('Please enter a valid phone number (at least 7 digits)');
      return;
    }
    
    setPhoneError('');
    setShowFormPopup(false);
    
    // Supabase'e verileri kaydet
    try {
      console.log("🟢 [SmileApp] Saving to Supabase...");
      const selectedStyle = STYLES.find(s => s.id === formData.style);
      const selectedShade = SHADES.find(s => s.id === formData.shade);
      
      if (resultAfter && selectedStyle && selectedShade) {
        await saveSubmissionToSupabase({
          timestamp: new Date().toISOString(),
          name: formData.name,
          phone: `${countryCode} ${formData.phone}`,
          email: '', // Email kaldırıldı
          freeTreatment: false,
          selectedToothType: selectedStyle.title,
          selectedToothColor: selectedShade.title,
          outputImgUrl: resultAfter
        });
        console.log("✅ [SmileApp] Successfully saved to Supabase");
        
        // Form gönderildi flag'ini set et - artık initial popup çıkmayacak
        sessionStorage.setItem('form_submitted', 'true');
      }
    } catch (error: any) {
      console.error("❌ [SmileApp] Supabase save failed:", error);
      // Hata olsa bile sessizce devam et, kullanıcı deneyimini bozma
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🟢 [SmileApp] Form submitted");
    console.log("🟢 [SmileApp] Form data:", {
      name: formData.name,
      phone: formData.phone,
      style: formData.style,
      shade: formData.shade,
      hasImage: !!formData.image,
      imageName: formData.image?.name,
      imageSize: formData.image?.size,
      imageType: formData.image?.type
    });
    
    setIsProcessing(true);
    setAiError(null);

    try {
      // Kullanıcının yüklediği resmi URL'ye çevir (preview için)
      let userImageUrl: string = '';
      if (formData.image) {
        console.log("🟢 [SmileApp] Processing user image...");
        // File'ı data URL'ye çevir (preview için)
        userImageUrl = URL.createObjectURL(formData.image);
        setResultBefore(userImageUrl);
        console.log("✅ [SmileApp] User image preview URL created");
      } else {
        console.error("❌ [SmileApp] No image uploaded");
        throw new Error('No image uploaded');
      }

      // Seçilen diş tipi resmini al
      const selectedStyle = STYLES.find(s => s.id === formData.style);
      if (!selectedStyle) {
        console.error("❌ [SmileApp] No style selected");
        throw new Error('No style selected');
      }
      console.log("✅ [SmileApp] Selected style:", selectedStyle);

      // Seçilen diş rengini al
      const selectedShade = SHADES.find(s => s.id === formData.shade);
      if (!selectedShade) {
        console.error("❌ [SmileApp] No shade selected");
        throw new Error('No shade selected');
      }
      console.log("✅ [SmileApp] Selected shade:", selectedShade);

      // Fal AI ile image editing işlemini başlat
      console.log("🟢 [SmileApp] Starting AI image editing...");
      const editedImageUrl = await editImageWithAI(
        formData.image, // Kullanıcının yüklediği resim
        selectedStyle.image, // Seçilen diş tipi resmi
        selectedShade.hex // Seçilen diş rengi hex kodu
      );

      // AI'dan gelen sonucu kaydet
      console.log("✅ [SmileApp] AI processing completed. Result URL:", editedImageUrl);
      setResultAfter(editedImageUrl);

      // Başarılı - sonuç ekranına geç ve form popup'ını göster
      console.log("✅ [SmileApp] All processes completed successfully");
      setIsProcessing(false);
      handleNext();
      // Form popup'ını göster
      setShowFormPopup(true);
    } catch (error: any) {
      console.error("❌ [SmileApp] AI Processing Error:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        response: error.response,
        status: error.status,
        statusText: error.statusText,
        data: error.data,
        fullError: error
      });
      setAiError(error.message || 'Failed to process image. Please try again.');
      setIsProcessing(false);
      // Hata durumunda da sonuç ekranına geç (fallback image ile)
      setResultAfter("/hero/good1.webp");
      if (!resultBefore && formData.image) {
        setResultBefore(URL.createObjectURL(formData.image));
      }
      handleNext();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col justify-center min-h-[calc(100vh-100px)] md:min-h-0">
      
      {/* Progress Bar (Visible but compact) */}
      <div className="mb-6 md:mb-12 shrink-0">
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: STYLE - OPTIMIZED FOR ONE SCREEN MOBILE */}
      {step === 1 && (
        <div className="flex flex-col h-full md:h-auto">
          <div className="text-center mb-4 md:mb-8 shrink-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-900">Choose your aesthetics</h2>
          </div>
          
          <div className="flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-6 flex-grow md:flex-grow-0">
            {STYLES.map((style) => (
              <div 
                key={style.id}
                onClick={() => {
                  // Seçimi yap ve animation state'ini set et
                  setFormData({ ...formData, style: style.id });
                  setSelectedStyleId(style.id);
                  
                  // 800ms sonra otomatik olarak bir sonraki adıma geç
                  setTimeout(() => {
                    handleNext();
                    setSelectedStyleId(null); // Animation state'ini temizle
                  }, 800);
                }}
                className={`
                  relative group cursor-pointer rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300
                  ${formData.style === style.id ? 'ring-4 ring-primary scale-105' : 'ring-1 ring-stone-200 hover:ring-primary/50'}
                  md:h-full md:min-h-[200px] md:w-full md:max-w-md
                  flex md:block items-center
                  h-32 md:h-auto
                `}
              >
                {/* Image */}
                <img 
                  src={style.image} 
                  alt={style.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 md:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-90 md:hidden" />

                {/* Content - Mobile: yatay, Desktop: alt */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 text-white flex justify-between items-end md:items-end">
                    <span className="font-bold text-base md:text-xl tracking-tight">{style.title}</span>
                    {(formData.style === style.id || selectedStyleId === style.id) && (
                        <div className="bg-primary p-1.5 rounded-full shadow-lg animate-in zoom-in-95 duration-300 shrink-0">
                            <Check size={16} className="text-white" />
                        </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: SHADE - OPTIMIZED FOR MOBILE LIST */}
      {step === 2 && (
        <div className="flex flex-col h-full justify-between md:justify-start space-y-4 md:space-y-8">
           <div className="text-center shrink-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-900">Select your shade</h2>
            <p className="text-stone-500 text-sm md:text-base">From natural brightness to Hollywood perfection.</p>
          </div>
          
          <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-6">
            {SHADES.map((shade) => (
              <Card 
                key={shade.id} 
                interactive 
                selected={formData.shade === shade.id || selectedShadeId === shade.id}
                onClick={() => {
                  // Seçimi yap ve animation state'ini set et
                  setFormData({ ...formData, shade: shade.id });
                  setSelectedShadeId(shade.id);
                  
                  // 800ms sonra otomatik olarak bir sonraki adıma geç
                  setTimeout(() => {
                    handleNext();
                    setSelectedShadeId(null); // Animation state'ini temizle
                  }, 800);
                }}
                className={`flex md:block items-center md:text-center p-4 md:p-10 space-x-4 md:space-x-0 md:space-y-4 cursor-pointer transition-all duration-300 relative ${
                  selectedShadeId === shade.id ? 'scale-105' : ''
                }`}
              >
                {/* Web view tick - Sağ üst köşede yuvarlak */}
                {(formData.shade === shade.id || selectedShadeId === shade.id) && (
                  <div className="hidden md:flex absolute top-2 right-2 bg-primary p-2 rounded-full shadow-lg z-10 animate-in zoom-in-95 duration-300">
                    <Check size={16} className="text-white" />
                  </div>
                )}
                
                <div 
                  className="w-12 h-12 md:w-20 md:h-20 rounded-full shrink-0 shadow-inner border border-stone-200"
                  style={{ backgroundColor: shade.hex }}
                ></div>
                <div className="text-left md:text-center flex-1">
                  <h3 className="font-bold text-lg text-stone-900 !text-stone-900">{shade.title}</h3>
                </div>
                {/* Mobile view tick */}
                {(formData.shade === shade.id || selectedShadeId === shade.id) && (
                  <div className="bg-primary p-1 rounded-full md:hidden animate-in zoom-in-95 duration-300">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="flex gap-4 pt-4 shrink-0 mt-auto md:mt-0">
             <Button variant="ghost" onClick={handleBack} className="flex-1 md:flex-none"><ChevronLeft size={18} className="mr-2"/> Back</Button>
          </div>
        </div>
      )}

      {/* STEP 3: UPLOAD - OPTIMIZED PADDING */}
      {step === 3 && (
        <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto w-full">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-900">Upload Your Photo</h2>
            <p className="text-stone-500 text-sm md:text-base">Selfie or close-up. Make sure teeth are visible. Photo will be cropped to square.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Upload Button */}
            <div className="border-4 border-dashed border-stone-200 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors relative group cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary group-hover:scale-110 transition-transform">
                <UploadCloud size={24} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-stone-900 mb-1">Upload</h3>
              <p className="text-stone-400 text-xs">From Gallery</p>
            </div>

            {/* Camera Button */}
            <div 
              onClick={handleCameraCapture}
              className="border-4 border-dashed border-stone-200 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors relative group cursor-pointer"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary group-hover:scale-110 transition-transform">
                <Camera size={24} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-stone-900 mb-1">Camera</h3>
              <p className="text-stone-400 text-xs">Take Photo</p>
            </div>
          </div>
            
            {uploadProgress > 0 && (
            <div className="max-w-xs mx-auto">
                <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              <p className="text-xs text-stone-500 mt-2 font-bold uppercase tracking-wider text-center">
                {uploadProgress < 50 ? 'Processing...' : 'Almost done...'} {uploadProgress}%
              </p>
              </div>
            )}

          <div className="flex justify-center pt-2">
             <Button variant="ghost" onClick={handleBack} className="text-stone-400">Back</Button>
          </div>
        </div>
      )}

      {/* STEP 4: AI PROCESSING - Auto-trigger, will show loading screen */}

      {/* GENERATION LOADING SCREEN - Beautiful intermediate screen */}
      {step === 4 && isProcessing && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-6">
            {/* Animated Icon */}
            <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
              <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-8 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h2 className="text-3xl md:text-5xl font-bold text-stone-900">
                Creating Your Perfect Smile
              </h2>
              <p className="text-lg md:text-xl text-stone-500 max-w-md mx-auto">
                Our AI is analyzing your photo and applying your selected aesthetic...
              </p>
            </div>

            {/* Progress Steps */}
            <div className="max-w-md mx-auto space-y-4 pt-8">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-stone-900">Photo Analyzed</p>
                  <p className="text-sm text-stone-500">Facial structure detected</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-stone-900">AI Processing</p>
                  <p className="text-sm text-stone-500">Applying {STYLES.find(s => s.id === formData.style)?.title} style...</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 opacity-60">
                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-stone-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-stone-600">Finalizing</p>
                  <p className="text-sm text-stone-400">Almost ready...</p>
                </div>
              </div>
            </div>

            {/* Loading Animation */}
            <div className="pt-8">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <p className="text-sm text-stone-400 mt-4 font-medium">This usually takes 30-60 seconds</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: RESULT - OPTIMIZED CARDS */}
      {step === 5 && (
        <div className="space-y-6 md:space-y-8 animate-in zoom-in-95 duration-700 max-w-2xl mx-auto w-full relative">
          {/* Blurred background overlay when form popup is shown */}
          {showFormPopup && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full animate-in zoom-in-95 duration-300">
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-2">Get Your Results</h2>
                  <p className="text-stone-500 text-sm md:text-base">Enter your details to access your transformation</p>
          </div>
          
                <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  className="w-full pl-11 pr-4 py-3 md:py-4 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm md:text-base"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2">
                <div className="relative w-24 md:w-28 group">
                  <select 
                    className="w-full h-full pl-2 md:pl-3 pr-2 py-3 md:py-4 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer font-medium text-sm md:text-base"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1 group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary" size={18} />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    required
                        className={`w-full pl-11 pr-4 py-3 md:py-4 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm md:text-base ${
                          phoneError ? 'ring-2 ring-red-500' : ''
                        }`}
                    value={formData.phone}
                        onChange={e => {
                          setFormData({...formData, phone: e.target.value});
                          setPhoneError(''); // Clear error on input
                        }}
                  />
                </div>
              </div>
                  
                  {phoneError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {phoneError}
            </div>
                  )}

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
                    className="py-4 md:py-5 text-lg shadow-xl shadow-primary/20"
                  >
                    Continue
            </Button>
          </form>
          </div>
        </div>
      )}

          <div className={`${showFormPopup ? 'blur-sm pointer-events-none' : ''}`}>
           <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-900">Your Future Smile</h2>
            <p className="text-stone-500 text-sm md:text-base">Based on {STYLES.find(s => s.id === formData.style)?.title} aesthetics</p>
              {aiError && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                  ⚠️ {aiError}
                </div>
              )}
          </div>

          {/* Before/After Slider - AI'dan gelen sonuçlar ile */}
          {resultBefore && resultAfter ? (
          <div className="w-full max-w-sm md:max-w-lg mx-auto bg-white p-2 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-stone-100">
             <BeforeAfterSlider 
                beforeImage={resultBefore} 
                afterImage={resultAfter} 
              />
          </div>
          ) : (
            <div className="w-full max-w-sm md:max-w-lg mx-auto bg-white p-2 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-stone-100 aspect-square flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          )}

          {/* Seçilen bilgileri göster */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-8">
            <Card className="p-3 md:p-4 text-center border-none bg-stone-50">
              <div className="text-lg md:text-2xl font-bold text-primary mb-1">
                {STYLES.find(s => s.id === formData.style)?.title.substring(0, 4)}
              </div>
              <div className="text-[9px] md:text-xs text-stone-500 uppercase tracking-wider font-bold">Style</div>
            </Card>
            <Card className="p-3 md:p-4 text-center border-none bg-stone-50">
              <div className="text-lg md:text-2xl font-bold text-primary mb-1">
                {SHADES.find(s => s.id === formData.shade)?.id.toUpperCase()}
              </div>
              <div className="text-[9px] md:text-xs text-stone-500 uppercase tracking-wider font-bold">Shade</div>
            </Card>
            <Card className="p-3 md:p-4 text-center border-none bg-stone-50">
              <div 
                className="w-8 h-8 md:w-12 md:h-12 rounded-full mx-auto mb-1 border-2 border-stone-200"
                style={{ backgroundColor: SHADES.find(s => s.id === formData.shade)?.hex }}
              ></div>
              <div className="text-[9px] md:text-xs text-stone-500 uppercase tracking-wider font-bold">Color</div>
            </Card>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 justify-center pt-4 md:pt-8">
            <Button 
              size="lg" 
              className="w-full py-4 md:py-5 text-lg shadow-emerald-900/20 shadow-2xl"
              onClick={async () => {
                // Download functionality - after image'ı indir
                if (resultAfter) {
                  try {
                    console.log("🟢 [SmileApp] Downloading image:", resultAfter);
                    
                    // URL'den resmi fetch et
                    const response = await fetch(resultAfter);
                    const blob = await response.blob();
                    
                    // Blob'u URL'ye çevir
                    const blobUrl = URL.createObjectURL(blob);
                    
                    // Download link oluştur
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `my-new-smile-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    
                    // Cleanup
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                    
                    console.log("✅ [SmileApp] Image downloaded successfully");
                  } catch (error) {
                    console.error("❌ [SmileApp] Download error:", error);
                    // Fallback: direkt link ile indirmeyi dene
                    const link = document.createElement('a');
                    link.href = resultAfter;
                    link.download = `my-new-smile-${Date.now()}.png`;
                    link.target = '_blank';
                    link.click();
                  }
                }
              }}
            >
              Download
            </Button>
            <Button variant="ghost" className="w-full text-stone-500 text-sm" onClick={onReset}>
              Design Another Smile
            </Button>
          </div>
          </div>
        </div>
      )}

    </div>
  );
};