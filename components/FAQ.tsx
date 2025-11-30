// FAQ Component - Accordion style FAQ section

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How does the AI smile design work?",
    answer: "Our advanced AI technology analyzes your facial structure and teeth from your uploaded photo. It then applies your selected aesthetic style and shade to create a realistic preview of your transformed smile. The entire process takes less than a minute."
  },
  {
    question: "Is the service really free?",
    answer: "Yes, absolutely! Design Your Teeth is 100% free to use. There are no hidden fees, no credit card required, and no sign-up necessary. Simply upload your photo and see your transformation instantly."
  },
  {
    question: "How accurate are the results?",
    answer: "Our AI technology has been trained on thousands of dental transformations and achieves 99% accuracy in smile design. However, please note that these are visual simulations for cosmetic purposes only and do not constitute medical advice."
  },
  {
    question: "Can I use the result image with my dentist?",
    answer: "Absolutely! Many users download their result images to discuss with their dentist. The preview helps you communicate your desired aesthetic goals more effectively during consultations."
  },
  {
    question: "What photo quality do I need?",
    answer: "For best results, use a clear, well-lit photo where your teeth are visible. A selfie or close-up photo works perfectly. Make sure your face is centered and the photo is in focus."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take your privacy seriously. Your uploaded photos are processed securely and are not shared with third parties. All data is encrypted and stored according to industry-standard security practices."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // İlk item açık başlasın

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-stone-50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <h2 className="text-4xl md:text-6xl font-bold text-stone-900 mb-12 md:mb-16">FAQ</h2>

        {/* FAQ Items */}
        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => {
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
                    {faq.question}
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
                    {faq.answer}
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

