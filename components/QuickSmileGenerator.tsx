import React, { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { UploadCloud, Camera, Sparkles, Loader2, Check, User, Phone, X, Download } from 'lucide-react';
import { cropImageToSquare, capturePhotoFromCamera } from '../utils/imageCrop';
import { editImageWithAI } from '../utils/falAI';
import { saveSubmissionToSupabase } from '../utils/supabase';
import { Language, translations } from '../utils/translations';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface QuickSmileGeneratorProps {
  language: Language;
  countryCode: string; // Phone prefix
}

export const QuickSmileGenerator: React.FC<QuickSmileGeneratorProps> = ({ language, countryCode }) => {
  const t = translations[language].quickGen;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [resultAfter, setResultAfter] = useState<string | null>(null);
  const [resultBefore, setResultBefore] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  
  // Form data
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [freeTreatment, setFreeTreatment] = useState(true);
  const [localCountryCode, setLocalCountryCode] = useState(countryCode);

  // Background AI processing state
  const [aiPromise, setAiPromise] = useState<Promise<string> | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processImage(e.target.files[0]);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const file = await capturePhotoFromCamera(
        1024,
        translations[language].camera.capture,
        translations[language].camera.cancel
      );
      if (file) {
        await processImage(file);
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert('Failed to access camera.');
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(10);
    setResultAfter(null);

    try {
      // 1. Crop
      setUploadProgress(30);
      const croppedFile = await cropImageToSquare(file, 1024);
      const beforeUrl = URL.createObjectURL(croppedFile);
      setResultBefore(beforeUrl);
      setUploadProgress(50);

      // 2. Start AI in background
      // Defaults: Natural Style, Natural Shade (A1 - #EEEEE2)
      console.log("🟢 [QuickSmile] Starting AI generation (Natural/Natural)...");
      const aiTask = editImageWithAI(
        croppedFile,
        '/tooth-types/natural.jpg',
        '#EEEEE2'
      );
      setAiPromise(aiTask);

      // 3. Wait for AI Result
      try {
        const resultUrl = await aiTask;
        console.log("✅ [QuickSmile] AI generation complete:", resultUrl);
        setResultAfter(resultUrl);
        
        // 4. Show Form with Blurred Result Preview ONLY AFTER result is ready
        setUploadProgress(100);
        setTimeout(() => {
            setShowForm(true);
            setIsProcessing(false); // Stop processing spinner
            setUploadProgress(0);
        }, 500);
      } catch (err) {
        console.error("❌ [QuickSmile] AI Error:", err);
        // Fallback to good1.png if AI fails, but still show form
        setResultAfter("/hero/good1.png");
        setShowForm(true);
        setIsProcessing(false);
      }

    } catch (error) {
      console.error("Processing error:", error);
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 7) {
      setPhoneError('Invalid phone number');
      return;
    }

    // Set loading state for submission
    setIsProcessing(true); 

    try {
      // Result is already in resultAfter because we waited for it
      const finalImageUrl = resultAfter || "/hero/good1.png";

      // Save to Supabase
      await saveSubmissionToSupabase({
        timestamp: new Date().toISOString(),
        name,
        phone: `${localCountryCode} ${phone}`,
        email: '',
        freeTreatment,
        selectedToothType: 'Natural (Quick)',
        selectedToothColor: 'BL3 (Quick)',
        outputImgUrl: finalImageUrl
      });

      // Show Result
      setShowForm(false);
      setIsProcessing(false);
      setAiPromise(null); // Clear promise
      
      // Store submission flag
      sessionStorage.setItem('form_submitted', 'true');

    } catch (error) {
      console.error("Submit error:", error);
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (resultAfter) {
      try {
        const response = await fetch(resultAfter);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `my-new-smile-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        window.open(resultAfter, '_blank');
      }
    }
  };

  const handleReset = () => {
    setResultAfter(null);
    setResultBefore(null);
    setName('');
    setPhone('');
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-16 md:mb-24">
      {/* Container */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100 relative">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

        <div className="p-8 md:p-12 lg:p-16 text-center">
            
            {!resultAfter && !isProcessing && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold tracking-wide border border-primary/10 mb-6">
                        <Sparkles size={16} />
                        <span>AI Instant Magic</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
                        {t.title}
                    </h2>
                    <p className="text-lg text-stone-500 max-w-2xl mx-auto mb-10">
                        {t.subtitle}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                        <div className="relative group cursor-pointer overflow-hidden rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 hover:border-primary hover:bg-stone-100 transition-all p-8">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-primary group-hover:scale-110 transition-transform">
                                <UploadCloud size={24} />
                            </div>
                            <h3 className="font-bold text-stone-900">{t.uploadBtn}</h3>
                            <p className="text-xs text-stone-400 mt-1">{t.uploadDesc}</p>
                        </div>

                        <div 
                            onClick={handleCameraCapture}
                            className="relative group cursor-pointer overflow-hidden rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 hover:border-primary hover:bg-stone-100 transition-all p-8"
                        >
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-primary group-hover:scale-110 transition-transform">
                                <Camera size={24} />
                            </div>
                            <h3 className="font-bold text-stone-900">{t.cameraBtn}</h3>
                            <p className="text-xs text-stone-400 mt-1">{t.instantCamera}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Processing State */}
            {isProcessing && !showForm && (
                <div className="py-12 animate-in fade-in duration-500">
                    {/* Beautiful Loading Animation */}
                    <div className="relative mx-auto w-32 h-32 mb-8">
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
                        <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse"></div>
                        <div className="absolute inset-8 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                            <Sparkles className="w-12 h-12 text-white animate-pulse" />
                        </div>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">{t.analyzing}</h3>
                    <p className="text-stone-500 mb-8 max-w-sm mx-auto">{t.generating}</p>
                    
                    {/* Enhanced Progress Bar */}
                    <div className="w-64 h-2 bg-stone-100 rounded-full mx-auto overflow-hidden relative">
                        <div 
                            className="h-full bg-primary transition-all duration-300 relative overflow-hidden" 
                            style={{ width: `${uploadProgress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                        </div>
                    </div>
                    
                    {/* Steps Indicator */}
                    <div className="mt-8 flex justify-center gap-2">
                         <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${uploadProgress > 0 ? 'bg-primary' : 'bg-stone-200'}`}></div>
                         <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${uploadProgress > 30 ? 'bg-primary' : 'bg-stone-200'}`}></div>
                         <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${uploadProgress > 60 ? 'bg-primary' : 'bg-stone-200'}`}></div>
                         <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${uploadProgress > 90 ? 'bg-primary' : 'bg-stone-200'}`}></div>
                    </div>
                </div>
            )}

            {/* Result State - Only show when form is NOT shown */}
            {resultAfter && resultBefore && !showForm && (
                <div className="animate-in fade-in zoom-in-95 duration-700">
                     <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-8">{t.resultTitle}</h2>
                     
                     <div className="max-w-md mx-auto mb-8">
                        <BeforeAfterSlider 
                            beforeImage={resultBefore}
                            afterImage={resultAfter}
                            onImageClick={() => setEnlargedImage(resultAfter)}
                        />
                         <p className="text-center text-xs text-stone-400 mt-3 flex items-center justify-center gap-1">
                            <Sparkles size={12} />
                            {t.tapToEnlarge}
                         </p>
                     </div>

                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={handleDownload} size="lg" className="shadow-xl shadow-primary/20">
                            <Download size={18} className="mr-2" />
                            {t.download}
                        </Button>
                        <Button onClick={handleReset} variant="ghost" size="lg">
                            {t.tryAgain}
                        </Button>
                     </div>
                </div>
            )}
        </div>
      </div>

      {/* Form Popup - Absolute overlay inside the container */}
      {showForm && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-xl p-4 animate-in fade-in duration-500">
             {/* Background image is effectively provided by the container if we remove the bg-white from the parent when showing form, 
                 OR we explicitly put it here. Let's explicitly put it here for the blur effect. */}
             {resultAfter && (
               <div className="absolute inset-0 z-[-1] overflow-hidden rounded-[2.5rem]">
                 <img src={resultAfter} alt="Background" className="w-full h-full object-cover blur-2xl opacity-60 scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/80"></div>
               </div>
             )}
             
             <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full animate-in zoom-in-95 duration-300 relative border border-white/50">
                {/* No Close Button - User must fill form to see result */}

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900">{t.formTitle}</h2>
                    <p className="text-stone-500 mt-2 text-sm">{t.formDesc}</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input 
                            type="text" 
                            placeholder={t.namePlaceholder}
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                        />
                    </div>

                    <div className="flex gap-2">
                         <div className="relative w-24">
                            <input 
                                type="text" 
                                value={localCountryCode}
                                onChange={e => setLocalCountryCode(e.target.value)}
                                className="w-full text-center py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-primary outline-none font-medium"
                            />
                        </div>
                         <div className="relative flex-1">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                            <input 
                                type="tel" 
                                placeholder={t.phonePlaceholder}
                                required
                                value={phone}
                                onChange={e => {
                                    setPhone(e.target.value);
                                    setPhoneError('');
                                }}
                                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all font-medium ${phoneError ? 'ring-2 ring-red-500' : ''}`}
                            />
                        </div>
                    </div>
                    {phoneError && <p className="text-red-500 text-sm px-2">{phoneError}</p>}

                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                        <input
                            type="checkbox"
                            id="freeTreatmentQuick"
                            checked={freeTreatment}
                            onChange={(e) => setFreeTreatment(e.target.checked)}
                            className="w-5 h-5 rounded border-stone-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer accent-primary"
                        />
                        <label htmlFor="freeTreatmentQuick" className="text-sm text-stone-700 cursor-pointer flex-1 leading-tight">
                            {t.freeTreatment}
                        </label>
                    </div>

                    <Button 
                      type="submit" 
                      fullWidth 
                      size="lg" 
                      className="py-4 shadow-lg"
                      disabled={isProcessing} 
                    >
                        {isProcessing ? ( 
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={18} />
                            {t.generating}
                          </span>
                        ) : (
                          t.continue
                        )}
                    </Button>
                    <p className="text-[10px] text-stone-400 text-center leading-tight px-4">
                        {t.terms}
                    </p>
                </form>
             </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300 p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <button 
            onClick={() => setEnlargedImage(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <img 
            src={enlargedImage} 
            alt="Enlarged" 
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

