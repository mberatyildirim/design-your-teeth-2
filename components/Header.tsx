
import React from 'react';
import { Button } from './ui/Button';
import { ViewState } from '../types';
import { Language, translations } from '../utils/translations';
import { Globe } from 'lucide-react';

interface HeaderProps {
  onStart: () => void;
  currentView: ViewState;
  onLogoClick: () => void;
  onNavigate: (section: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const ToothIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 2c-2.5 0-4 2.5-4 5.5c0 2.5 1.5 4.5 1.5 6.5c0 3.5 2.5 6 4.5 6s2.5-3 3-3s1 3 3 3s4.5-2.5 4.5-6c0-2 1.5-4 1.5-6.5C21 4.5 19.5 2 17 2c-2.5 0-3 2.5-3 2.5S13.5 2 11 2s-3 2.5-3 2.5S7.5 2 7 2z" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ onStart, currentView, onLogoClick, onNavigate, language, setLanguage }) => {
  const t = translations[language].nav;

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onLogoClick}
        >
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-md">
            <ToothIcon className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">Design Your Teeth</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => onNavigate('how-it-works')} className="text-stone-600 hover:text-primary font-medium transition-colors">{t.howItWorks}</button>
          <button onClick={() => onNavigate('stories')} className="text-stone-600 hover:text-primary font-medium transition-colors">{t.realStories}</button>
          <button onClick={() => onNavigate('features')} className="text-stone-600 hover:text-primary font-medium transition-colors">{t.features}</button>
        </nav>

        {/* CTA & Language */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'bg' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors text-sm font-medium"
          >
            <Globe size={16} />
            {language === 'en' ? 'EN' : 'BG'}
          </button>

          {currentView === 'app' ? (
            <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t.designMode}
            </div>
          ) : (
            <Button onClick={onStart} size="sm" className="font-bold hidden sm:flex">{t.tryFree}</Button>
          )}
        </div>
      </div>
    </header>
  );
};
