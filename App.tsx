
import React, { useState, useEffect } from 'react';
import { ViewState, AppStep, FormData } from './types';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SmileApp } from './components/SmileApp';
import { Button } from './components/ui/Button';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';

// Simple text pages for legal/contact
const SimplePage = ({ title, children, onBack }: { title: string, children?: React.ReactNode, onBack: () => void }) => (
  <div className="max-w-3xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <Button variant="ghost" onClick={onBack} className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
      ← Back to Home
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
  const [formData, setFormData] = useState<FormData>({
    style: '',
    shade: '',
    image: null,
    name: '',
    email: '',
    phone: ''
  });

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
    if (showLogin) {
      return <Login onLogin={handleAdminLogin} />;
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
          />
        );
      case 'contact':
        return (
           <SimplePage title="Contact Us" onBack={handleLogoClick}>
             <p className="text-lg mb-8">We are here to help you achieve your perfect smile. Our support team is available Monday through Friday, 9am to 6pm EST.</p>
             <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-xl max-w-xl">
                <h3 className="font-bold text-xl mb-6 text-stone-900">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div>
                      <p className="text-sm text-stone-400 font-bold uppercase">Email</p>
                      <a href="mailto:info@designyourteeth.com" className="text-lg font-medium hover:text-primary transition-colors">info@designyourteeth.com</a>
                    </div>
                  </div>
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                      <p className="text-sm text-stone-400 font-bold uppercase">Phone</p>
                      <p className="text-lg font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
             </div>
           </SimplePage>
        );
      case 'privacy':
        return (
          <SimplePage title="Privacy Policy" onBack={handleLogoClick}>
            <p className="lead text-lg mb-6">Effective Date: January 1, 2025</p>
            <p>At Design Your Teeth, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you visit our website or use our AI smile design services.</p>
            
            <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">1. Information We Collect</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Identification Information:</strong> Name, email address, phone number, and other contact details you voluntarily provide.</li>
              <li><strong>Biometric & Visual Data:</strong> Facial images and photographs of your teeth that you upload for the purpose of generating smile simulations.</li>
              <li><strong>Usage Data:</strong> Information on how you interact with our website, including access times, pages viewed, and your IP address.</li>
            </ul>

            <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">2. How We Use Your Information</h3>
            <p>We use the collected data for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and maintain our AI simulation service.</li>
              <li>To improve our algorithms and user experience (images are anonymized before being used for training).</li>
              <li>To communicate with you regarding your results, updates, and promotional offers.</li>
              <li>To prevent fraudulent activity and ensure the security of our platform.</li>
            </ul>

            <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">3. Data Security</h3>
            <p>We implement industry-standard security measures to protect your personal information. Your uploaded images are processed securely and are not shared with third parties without your explicit consent, except as required by law.</p>

            <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">4. Third-Party Services</h3>
            <p>We may employ third-party companies and individuals to facilitate our Service, to provide the Service on our behalf, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
          </SimplePage>
        );
      case 'terms':
        return (
          <SimplePage title="Terms of Service" onBack={handleLogoClick}>
             <p className="lead text-lg mb-6">Last Updated: January 1, 2025</p>
             <p>Please read these Terms of Service ("Terms") carefully before using the Design Your Teeth website and services operated by Design Your Teeth Inc.</p>

             <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">1. Acceptance of Terms</h3>
             <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

             <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">2. Medical Disclaimer</h3>
             <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 text-amber-900 my-4">
               <strong>Important:</strong> The visualizations provided by Design Your Teeth are for cosmetic simulation purposes only and do not constitute medical or dental advice, diagnosis, or treatment planning. Always seek the advice of your dentist or other qualified health provider with any questions you may have regarding a dental condition.
             </div>

             <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">3. User Responsibilities</h3>
             <p>You represent and warrant that:</p>
             <ul className="list-disc pl-5 space-y-2">
               <li>You have the legal right to upload the images you submit.</li>
               <li>You will not use the service for any illegal or unauthorized purpose.</li>
               <li>You will not attempt to reverse engineer any aspect of the Service.</li>
             </ul>

             <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">4. Intellectual Property</h3>
             <p>The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Design Your Teeth Inc. and its licensors.</p>

             <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">5. Limitation of Liability</h3>
             <p>In no event shall Design Your Teeth, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          </SimplePage>
        );
      case 'login':
        return showLogin ? <Login onLoginSuccess={handleAdminLogin} onClose={() => { setShowLogin(false); setView('landing'); window.history.pushState({}, '', '/'); }} /> : <LandingPage onStart={handleStart} />;
      case 'landing':
      default:
        return <LandingPage onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-stone-900 selection:bg-primary/10 selection:text-primary flex flex-col overflow-x-hidden">
      {view !== 'admin' && !showLogin && (
        <Header 
          onStart={handleStart} 
          currentView={view} 
          onLogoClick={handleLogoClick}
          onNavigate={handleNavigate}
        />
      )}
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-stone-100 py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-primary mb-4">Design Your Teeth</h3>
            <p className="text-stone-500 max-w-sm">Transform your smile with our advanced dental technology and expert care.</p>
          </div>
          
          <div>
            <h4 className="font-bold text-stone-900 mb-4">Explore</h4>
            <ul className="space-y-2 text-stone-500">
              <li>
                <button onClick={() => handleNavigate('how-it-works')} className="hover:text-primary text-left">How it Works</button>
              </li>
              <li>
                <button onClick={() => handleNavigate('stories')} className="hover:text-primary text-left">Real Stories</button>
              </li>
              <li>
                <button onClick={() => handleNavigate('features')} className="hover:text-primary text-left">Features</button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-stone-900 mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-stone-500">
              <li>
                <button onClick={() => handleNavigate('contact')} className="hover:text-primary text-left">Contact Us</button>
              </li>
              <li>
                <button onClick={() => setView('privacy')} className="hover:text-primary text-left">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => setView('terms')} className="hover:text-primary text-left">Terms of Service</button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-stone-100 text-center text-sm text-stone-400">
          <p>© 2025 Design Your Teeth. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
