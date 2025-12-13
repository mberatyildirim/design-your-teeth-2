
import React, { useState, useEffect } from 'react';
import { ViewState, AppStep, FormData } from './types';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SmileApp } from './components/SmileApp';
import { Button } from './components/ui/Button';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { User, Phone, X } from 'lucide-react';
import { getUserCountryInfo } from './utils/geolocation';
import { saveSubmissionToSupabase } from './utils/supabase';
import { Language, translations } from './utils/translations';

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+90', flag: '🇹🇷' },
  { code: '+49', flag: '🇩🇪' },
  { code: '+33', flag: '🇫🇷' },
];

// Simple text pages for legal/contact
const SimplePage = ({ title, children, onBack }: { title: string, children?: React.ReactNode, onBack: () => void }) => (
  <div className="max-w-3xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <Button variant="ghost" onClick={onBack} className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
      ← Back
    </Button>
    <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-8">{title}</h1>
    <div className="prose prose-stone max-w-none text-stone-600 space-y-4">
      {children}
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [appStep, setAppStep] = useState<AppStep>(1);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Initial loading state
  const [showInitialPopup, setShowInitialPopup] = useState(false); // Initial popup state
  const [initialFormData, setInitialFormData] = useState({ name: '', phone: '' }); // Initial popup form data
  const [freeTreatment, setFreeTreatment] = useState(true); // Free treatment checkbox - default true
  const [countryCode, setCountryCode] = useState('+1'); // Country code for initial popup
  const [phoneError, setPhoneError] = useState<string>(''); // Phone format error
  
  // Language & Country
  const [language, setLanguage] = useState<Language>('en');
  
  // Translations helper
  const t = translations[language] || translations['en'];
  
  const [formData, setFormData] = useState<FormData>({
    style: '',
    shade: '',
    image: null,
    name: '',
    email: '',
    phone: ''
  });

  // User'ın konumuna ve diline göre ayarla
  useEffect(() => {
    getUserCountryInfo().then(info => {
      setCountryCode(info.callingCode);
      
      // Auto-set language if in Bulgaria
      if (info.countryCode === 'BG') {
        setLanguage('bg');
      }
    });
  }, []);

  // Initial loading - 1-2 saniye göster, sonra popup göster (POPUP DISABLED)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      // Loading bitince popup'ı göster (sadece landing page'de)
      /* 
      // DISABLED: Initial Popup
      if (view === 'landing' && window.location.pathname !== '/admin') {
        // Kullanıcı formu göndermiş mi kontrol et
        // Eğer form gönderilmişse popup gösterme, gönderilmemişse her seferinde göster
        const formSubmitted = sessionStorage.getItem('form_submitted') === 'true';
        if (!formSubmitted) {
          setShowInitialPopup(true);
        }
      }
      */
    }, 2000); // 2 saniye loading
    return () => clearTimeout(timer);
  }, [view]);

  // Telefon format kontrolü
  const validatePhoneFormat = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    const digitCount = phone.replace(/\D/g, '').length;
    return phoneRegex.test(phone) && digitCount >= 7;
  };

  // Initial popup form submit
  const handleInitialPopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneFormat(initialFormData.phone)) {
      setPhoneError('Please enter a valid phone number (at least 7 digits)');
      return;
    }
    
    setPhoneError('');
    
    // Supabase'e ilk popup formunu kaydet (eksik alanlar boş/null olacak)
    try {
      console.log("🟢 [App] Saving initial popup form to Supabase...");
      await saveSubmissionToSupabase({
        timestamp: new Date().toISOString(),
        name: initialFormData.name,
        phone: `${countryCode} ${initialFormData.phone}`,
        email: '', // Email yok
        freeTreatment: freeTreatment,
        selectedToothType: '', // Henüz seçilmedi
        selectedToothColor: '', // Henüz seçilmedi
        outputImgUrl: '' // Henüz oluşturulmadı
      });
      console.log("✅ [App] Initial popup form saved to Supabase");
    } catch (error: any) {
      console.error("❌ [App] Failed to save initial popup form to Supabase:", error);
      // Hata olsa bile devam et
    }
    
    // Form data'yı ana formData'ya kaydet
    setFormData(prev => ({
      ...prev,
      name: initialFormData.name,
      phone: initialFormData.phone
    }));
    // Popup'ı kapat (form gönderilmediği için flag set etme, böylece tekrar çıkacak)
    setShowInitialPopup(false);
  };

  // Initial popup'ı kapat (sadece kapat, flag set etme - böylece tekrar çıkacak)
  const handleCloseInitialPopup = () => {
    setShowInitialPopup(false);
  };

  // Form popup'ını aç (VideoSection'dan çağrılacak)
  const handleOpenFormPopup = () => {
    // Form gönderilmiş mi kontrol et
    const formSubmitted = sessionStorage.getItem('form_submitted') === 'true';
    if (!formSubmitted) {
      setShowInitialPopup(true);
    } else {
      // Form gönderilmişse direkt app'e yönlendir
      handleStart();
    }
  };

  // URL routing ve session kontrolü
  useEffect(() => {
    // URL'den admin path'ini kontrol et
    const path = window.location.pathname;
    if (path === '/admin' || path === '/admin/') {
      const loggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
      if (loggedIn) {
        setIsAdminLoggedIn(true);
        setShowLogin(false);
        setView('admin');
      } else {
        setShowLogin(true);
        setView('login'); // Login view'ını göster
      }
    } else {
      // Normal sayfa yükleme
      setView('landing');
      const loggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
      setIsAdminLoggedIn(loggedIn);
      setShowLogin(false);
    }
  }, []);

  // Admin login handler - Login sonrası direkt admin paneline git
  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setShowLogin(false);
    setView('admin');
    // URL'yi güncelle
    window.history.pushState({}, '', '/admin');
  };

  // Admin logout handler
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setShowLogin(true);
    sessionStorage.removeItem('admin_logged_in');
    setView('landing');
    // URL'yi ana sayfaya yönlendir
    window.history.pushState({}, '', '/');
  };

  const handleStart = () => {
    setView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setView('landing');
    setAppStep(1);
    setFormData({
      style: '',
      shade: '',
      image: null,
      name: '',
      email: '',
      phone: ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetApp = () => {
    setAppStep(1);
    setFormData({
      style: '',
      shade: '',
      image: null,
      name: '',
      email: '',
      phone: ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (section: string) => {
    if (section === 'contact') {
      setView('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Logic to scroll to section
      if (view !== 'landing') {
        setView('landing');
        setTimeout(() => {
          const el = document.getElementById(section);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
         const el = document.getElementById(section);
         if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const renderContent = () => {
    // Login ekranı göster
    if (showLogin && view === 'login') {
      return <Login onLoginSuccess={handleAdminLogin} onClose={() => { setShowLogin(false); setView('landing'); window.history.pushState({}, '', '/'); }} />;
    }

    // Admin panel göster
    if (view === 'admin' && isAdminLoggedIn) {
      return <AdminPanel onLogout={handleAdminLogout} />;
    }

    switch (view) {
      case 'app':
        return (
          <SmileApp 
            step={appStep} 
            setStep={setAppStep} 
            formData={formData} 
            setFormData={setFormData}
            onReset={handleResetApp}
            language={language}
          />
        );
      case 'contact':
        return (
           <SimplePage title={t.contact.title} onBack={handleLogoClick}>
             <p className="text-lg mb-8">{t.contact.desc}</p>
             <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-xl max-w-xl">
                <h3 className="font-bold text-xl mb-6 text-stone-900">{t.contact.getInTouch}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div>
                      <p className="text-sm text-stone-400 font-bold uppercase">{t.contact.email}</p>
                      <a href="mailto:info@designyourteeth.com" className="text-lg font-medium hover:text-primary transition-colors">info@designyourteeth.com</a>
                    </div>
                  </div>
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                      <p className="text-sm text-stone-400 font-bold uppercase">{t.contact.phone}</p>
                      <p className="text-lg font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
             </div>
           </SimplePage>
        );
      case 'privacy':
        return (
          <SimplePage title={t.privacy.title} onBack={handleLogoClick}>
            <p className="lead text-lg mb-6">{t.privacy.date}</p>
            <p>{t.privacy.intro}</p>
            
            <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">{t.privacy.section1Title}</h3>
            <ul className="list-disc pl-5 space-y-2">
              {t.privacy.section1Content.map((item, i) => <li key={i}>{item}</li>)}
            </ul>

            <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">{t.privacy.section2Title}</h3>
            <p>{t.privacy.section2Intro}</p>
            <ul className="list-disc pl-5 space-y-2">
              {t.privacy.section2Content.map((item, i) => <li key={i}>{item}</li>)}
            </ul>

            <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">{t.privacy.section3Title}</h3>
            <p>{t.privacy.section3Content}</p>

            <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">{t.privacy.section4Title}</h3>
            <p>{t.privacy.section4Content}</p>
          </SimplePage>
        );
      case 'terms':
        return (
          <SimplePage title={t.terms.title} onBack={handleLogoClick}>
             <p className="lead text-lg mb-6">{t.terms.date}</p>
             <p>{t.terms.intro}</p>

             <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">{t.terms.section1Title}</h3>
             <p>{t.terms.section1Content}</p>

             <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">{t.terms.section2Title}</h3>
             <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 text-amber-900 my-4">
               {t.terms.section2Content}
             </div>

             <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">{t.terms.section3Title}</h3>
             <p>{t.terms.section3Intro}</p>
             <ul className="list-disc pl-5 space-y-2">
               {t.terms.section3Content.map((item, i) => <li key={i}>{item}</li>)}
             </ul>

             <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">{t.terms.section4Title}</h3>
             <p>{t.terms.section4Content}</p>

             <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">{t.terms.section5Title}</h3>
             <p>{t.terms.section5Content}</p>
          </SimplePage>
        );
      case 'login':
        return showLogin ? <Login onLoginSuccess={handleAdminLogin} onClose={() => { setShowLogin(false); setView('landing'); window.history.pushState({}, '', '/'); }} /> : <LandingPage onStart={handleStart} onOpenForm={handleOpenFormPopup} language={language} countryCode={countryCode} />;
      case 'landing':
      default:
        return <LandingPage onStart={handleStart} onOpenForm={handleOpenFormPopup} language={language} countryCode={countryCode} />;
    }
  };

  // Initial loading screen
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-surface font-sans text-stone-900 flex items-center justify-center">
        <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
            <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-8 bg-primary rounded-full flex items-center justify-center shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 md:w-16 md:h-16 text-white">
                <path d="M7 2c-2.5 0-4 2.5-4 5.5c0 2.5 1.5 4.5 1.5 6.5c0 3.5 2.5 6 4.5 6s2.5-3 3-3s1 3 3 3s4.5-2.5 4.5-6c0-2 1.5-4 1.5-6.5C21 4.5 19.5 2 17 2c-2.5 0-3 2.5-3 2.5S13.5 2 11 2s-3 2.5-3 2.5S7.5 2 7 2z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary">{language === 'en' ? 'Free Smile Design' : 'Безплатен дизайн на усмивка'}</h1>
          <p className="text-lg md:text-xl text-stone-500">{language === 'en' ? 'Design your perfect smile in seconds' : 'Проектирайте перфектната си усмивка за секунди'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-stone-900 selection:bg-primary/10 selection:text-primary flex flex-col overflow-x-hidden">
      {/* Initial Popup - Blurred background with form */}
      {showInitialPopup && view === 'landing' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full animate-in zoom-in-95 duration-300 relative">
            <button
              onClick={handleCloseInitialPopup}
              className="absolute top-4 right-4 w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors text-stone-600 hover:text-stone-900"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-2">Get Started</h2>
              <p className="text-stone-500 text-sm md:text-base">Enter your details to begin your smile transformation</p>
            </div>
            
            <form onSubmit={handleInitialPopupSubmit} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  className="w-full pl-11 pr-4 py-3 md:py-4 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm md:text-base"
                  value={initialFormData.name}
                  onChange={e => setInitialFormData({...initialFormData, name: e.target.value})}
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
                    value={initialFormData.phone}
                    onChange={e => {
                      setInitialFormData({...initialFormData, phone: e.target.value});
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
              
              {/* Free Treatment Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
                <input
                  type="checkbox"
                  id="freeTreatment"
                  checked={freeTreatment}
                  onChange={(e) => setFreeTreatment(e.target.checked)}
                  className="w-5 h-5 rounded border-stone-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer accent-primary"
                  style={{ accentColor: '#0F2F28' }}
                />
                <label htmlFor="freeTreatment" className="text-sm md:text-base text-stone-700 cursor-pointer flex-1">
                  Would you like to get your free treatment plan?
                </label>
              </div>
              
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

      {view !== 'admin' && !showLogin && (
        <Header 
          onStart={handleStart} 
          currentView={view} 
          onLogoClick={handleLogoClick}
          onNavigate={handleNavigate}
          language={language}
          setLanguage={setLanguage}
        />
      )}
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-stone-100 py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-primary mb-4">Design Your Teeth</h3>
            <p className="text-stone-500 max-w-sm">{language === 'en' ? 'Transform your smile with our advanced dental technology and expert care.' : 'Трансформирайте усмивката си с нашата модерна дентална технология и експертна грижа.'}</p>
          </div>
          
          <div>
            <h4 className="font-bold text-stone-900 mb-4">{language === 'en' ? 'Explore' : 'Разгледай'}</h4>
            <ul className="space-y-2 text-stone-500">
              <li>
                <button onClick={() => handleNavigate('how-it-works')} className="hover:text-primary text-left">{language === 'en' ? 'How it Works' : 'Как работи'}</button>
              </li>
              <li>
                <button onClick={() => handleNavigate('stories')} className="hover:text-primary text-left">{language === 'en' ? 'Real Stories' : 'Истории'}</button>
              </li>
              <li>
                <button onClick={() => handleNavigate('features')} className="hover:text-primary text-left">{language === 'en' ? 'Features' : 'Функции'}</button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-stone-900 mb-4">{language === 'en' ? 'Legal & Support' : 'Правна информация'}</h4>
            <ul className="space-y-2 text-stone-500">
              <li>
                <button onClick={() => handleNavigate('contact')} className="hover:text-primary text-left">{language === 'en' ? 'Contact Us' : 'Контакт'}</button>
              </li>
              <li>
                <button onClick={() => setView('privacy')} className="hover:text-primary text-left">{language === 'en' ? 'Privacy Policy' : 'Политика за поверителност'}</button>
              </li>
              <li>
                <button onClick={() => setView('terms')} className="hover:text-primary text-left">{language === 'en' ? 'Terms of Service' : 'Условия за ползване'}</button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-stone-100 text-center text-sm text-stone-400">
          <p>{language === 'en' ? '© 2025 Design Your Teeth. All rights reserved.' : '© 2025 Design Your Teeth. Всички права запазени.'}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
