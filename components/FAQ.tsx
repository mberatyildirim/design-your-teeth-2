// FAQ Component - Accordion style FAQ section

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface FAQProps {
  language?: Language;
}

export const FAQ: React.FC<FAQProps> = ({ language = 'en' }) => {
  const t = translations[language].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0); // İlk item açık başlasın

  const faqData = [
    { q: t.q1, a: t.a1 },
    { q: t.q2, a: t.a2 },
    { q: t.q3, a: t.a3 },
    { q: t.q4, a: t.a4 },
    { q: t.q5, a: t.a5 },
    { q: t.q6, a: t.a6 },
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-stone-50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <h2 className="text-4xl md:text-6xl font-bold text-stone-900 mb-12 md:mb-16">{t.title}</h2>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'shadow-xl border-2 border-stone-900' 
                    : 'shadow-sm border border-stone-200 hover:shadow-md'
                }`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                >
                  <span className={`font-bold text-lg md:text-xl flex-1 ${
                    isOpen ? 'text-stone-900' : 'text-stone-700'
                  }`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen 
                      ? 'bg-stone-900 text-white rotate-90' 
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {isOpen ? (
                      <X size={20} className="md:w-6 md:h-6" />
                    ) : (
                      <Plus size={20} className="md:w-6 md:h-6" />
                    )}
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-8 text-stone-600 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

