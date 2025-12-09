
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { VideoSection } from './VideoSection';
import { FAQ } from './FAQ';
import { Sparkles, CheckCircle2, ArrowRight, Zap, Smartphone, DollarSign, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onOpenForm?: () => void;
}

const HERO_EXAMPLES = [
  {
    id: 1,
    name: "David",
    type: "David, 27",
    before: "/hero/bad1.png", 
    after: "/hero/good1.png"
  },
  {
    id: 2,
    name: "Anna",
    type: "Anna, 31",
    before: "/hero/bad2.png",
    after: "/hero/good2.png"
  },
  {
    id: 3,
    name: "Sarah",  
    type: "Sarah, 28",
    before: "/hero/bad3.png",
    after: "/hero/good3.png"
  },
  {
    id: 4,
    name: "Emma",
    type: "Emma, 30",
    before: "/hero/bad4.png",
    after: "/hero/good4.png"
  },
  {
    id: 5,
    name: "Jessica",
    type: "Jessica, 32",
    before: "/hero/bad5.png",
    after: "/hero/good5.png"
  },
  {
    id: 6,
    name: "Jack",
    type: "Jack, 29",
    before: "/hero/bad6.png",
    after: "/hero/good6.png"
  }
];

const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    location: "New York, USA",
    text: "I was hesitant about veneers, but seeing the preview changed everything. I knew exactly what I wanted before walking into the clinic.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Marcus Chen",
    location: "London, UK",
    text: "The AI is incredibly accurate. The result I got from my dentist matched the Design Your Teeth preview almost perfectly. Highly recommend!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Elena Rodriguez",
    location: "Madrid, Spain",
    text: "So easy to use. I tried the Hollywood style and fell in love. It helped me communicate better with my orthodontist.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
  }
];

const HOW_IT_WORKS_STEPS = [
  {
    num: "01",
    title: "Upload Photo",
    desc: "Take a selfie or upload a clear photo. AI analyzes it in seconds.",
    image: "/how-it-works/step-1.png"
  },
  {
    num: "02",
    title: "AI Analysis",
    desc: "Our advanced tech maps your facial structure and designs the perfect smile.",
    image: "/how-it-works/step-2.png"
  },
  {
    num: "03",
    title: "Instant Result",
    desc: "See your transformation immediately. Compare before & after in high-res.",
    image: "/how-it-works/step-3.png"
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenForm }) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [nextImageLoaded, setNextImageLoaded] = useState(false); // Bir sonraki görsel yüklendi mi?

  const nextHero = () => setCurrentHeroIndex((prev) => (prev + 1) % HERO_EXAMPLES.length);
  const prevHero = () => setCurrentHeroIndex((prev) => (prev - 1 + HERO_EXAMPLES.length) % HERO_EXAMPLES.length);

  useEffect(() => {
    const timer = setInterval(nextHero, 5000);
    return () => clearInterval(timer);
  }, []);

  // Tüm görselleri preload et - sayfa yüklendiğinde
  useEffect(() => {
    HOW_IT_WORKS_STEPS.forEach((step) => {
      const img = new Image();
      img.src = step.image;
    });
  }, []);

  // Bir sonraki görseli preload et ve yükleme durumunu takip et
  useEffect(() => {
    const nextIndex = (currentStepIndex + 1) % HOW_IT_WORKS_STEPS.length;
    const nextImage = new Image();
    
    setNextImageLoaded(false);
    
    // Görsel zaten cache'de olabilir, kontrol et
    nextImage.onload = () => {
      setNextImageLoaded(true);
    };
    
    nextImage.onerror = () => {
      // Hata durumunda da true yap ki geçiş yapılabilsin
      setNextImageLoaded(true);
    };
    
    // Görseli yükle
    nextImage.src = HOW_IT_WORKS_STEPS[nextIndex].image;
    
    // Eğer görsel zaten yüklenmişse (cache'den)
    if (nextImage.complete) {
      setNextImageLoaded(true);
    }
  }, [currentStepIndex]);

  // How It Works steps otomatik geçiş - bir sonraki görsel yüklendikten sonra geçiş yap
  useEffect(() => {
    const stepTimer = setInterval(() => {
      // Bir sonraki görsel yüklendiyse geçiş yap, yoksa bekle
      if (nextImageLoaded) {
        setCurrentStepIndex((prev) => (prev + 1) % HOW_IT_WORKS_STEPS.length);
      }
    }, 4000); // 4 saniyede bir geçiş
    
    return () => clearInterval(stepTimer);
  }, [nextImageLoaded]);

  return (
    <div className="flex flex-col gap-24 pb-24 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="pt-8 md:pt-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold tracking-wide border border-primary/10">
              <Star size={14} className="fill-primary" />
              <span>#1 AI Smile Designer</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-stone-900 leading-[1.05]">
              Design Your <br/>
              <span className="text-primary italic relative">
                Dream Smile %100 Free
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-stone-500 font-light max-w-lg leading-relaxed">
              Visualize your perfect smile instantly with our revolutionary AI. 
              Upload a photo and see the magic happen in seconds.
            </p>
            
            {/* Desktop Button - Hidden on mobile */}
            <div className="hidden lg:flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={onStart} size="lg" className="px-10 text-lg shadow-xl shadow-primary/20">
                Try It Free Now <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-stone-500 pt-2">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 size={14} className="text-green-600" /></div>
                <span>100% Free Tool</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 size={14} className="text-green-600" /></div>
                <span>No Sign Up Required</span>
              </div>
            </div>
          </div>

          {/* Square Hero Visual */}
          <div className="relative order-1 lg:order-2 max-w-lg mx-auto lg:max-w-none w-full">
             {/* Decorative Elements */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
             
             <div className="relative bg-white p-3 rounded-[2.5rem] shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-700 ease-out border border-stone-100">
               {/* Nav Buttons */}
               <button onClick={prevHero} className="absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white text-stone-800 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all border border-stone-100">
                  <ChevronLeft size={24} />
               </button>
               <button onClick={nextHero} className="absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white text-stone-800 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all border border-stone-100">
                  <ChevronRight size={24} />
               </button>

               <div className="relative rounded-[2rem] overflow-hidden">
                 <BeforeAfterSlider 
                    key={currentHeroIndex} // Force re-render on change
                    beforeImage={HERO_EXAMPLES[currentHeroIndex].before}
                    afterImage={HERO_EXAMPLES[currentHeroIndex].after}
                  />
               </div>

                {/* Caption */}
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-stone-100 whitespace-nowrap z-20 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="font-bold text-stone-800">{HERO_EXAMPLES[currentHeroIndex].type}</span>
               </div>
             </div>
             
             {/* Mobile Button - Shown only on mobile, right after before/after slider */}
             <div className="lg:hidden flex justify-center pt-6 -mt-4">
               <Button onClick={onStart} size="lg" className="px-10 text-lg shadow-xl shadow-primary/20 w-full max-w-sm">
                 Try It Free Now <ArrowRight size={20} className="ml-2" />
               </Button>
             </div>
          </div>
        </div>
      </section>

      {/* Trusted By Strip */}
      <section className="border-y border-stone-100 bg-white py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-8">Trusted by Dental Professionals Worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
                {/* Simple Typography Logos */}
                <span className="text-2xl font-serif font-bold">DENTICA</span>
                <span className="text-2xl font-sans font-black tracking-tighter">SMILEPRO</span>
                <span className="text-2xl font-mono font-bold">ortho+</span>
                <span className="text-2xl font-serif italic">Lumina</span>
                <span className="text-2xl font-sans font-bold">ALIGN</span>
            </div>
        </div>
      </section>

      {/* Feature Steps - Modern Design */}
      <section id="how-it-works" className="px-4 md:px-6 py-16 md:py-20 max-w-6xl mx-auto">
        <div className="space-y-8 md:space-y-10">
          {/* Section Title */}
          <h2 className="text-3xl md:text-5xl font-bold text-stone-900">How It Works</h2>

          {/* Main Content Card */}
          <div className="bg-stone-50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 lg:p-12 relative overflow-hidden">
            {/* Scroll Indicator */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-stone-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors z-20">
              <ChevronRight size={16} className="md:w-5 md:h-5 text-stone-400 rotate-90" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
              {/* Left Side - Content */}
              <div className="space-y-6 md:space-y-8">
                {/* Step Number */}
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="bg-white rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg shrink-0">
                    <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900">
                      {HOW_IT_WORKS_STEPS[currentStepIndex].num}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mb-3 md:mb-4">
                      {HOW_IT_WORKS_STEPS[currentStepIndex].title}
                    </h3>
                    <p className="text-base md:text-lg text-stone-600 leading-relaxed">
                      {HOW_IT_WORKS_STEPS[currentStepIndex].desc}
                    </p>
                  </div>
                </div>

                {/* Navigation List */}
                <div className="space-y-2 md:space-y-3 pt-6 md:pt-8">
                  {HOW_IT_WORKS_STEPS.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStepIndex(idx)}
                      className={`w-full text-left p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 ${
                        currentStepIndex === idx
                          ? 'bg-stone-900 text-white shadow-lg'
                          : 'bg-white text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span className="font-bold text-base md:text-lg">{step.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side - Visual */}
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center bg-stone-100 rounded-2xl md:rounded-3xl overflow-hidden">
                <img
                  src={HOW_IT_WORKS_STEPS[currentStepIndex].image}
                  alt={HOW_IT_WORKS_STEPS[currentStepIndex].title}
                  className="w-full h-full object-contain"
                  key={currentStepIndex}
                  loading="eager" // Görseli hemen yükle
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="stories" className="px-6 py-24 max-w-7xl mx-auto">
         <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold text-stone-900">Real Stories</h2>
            <p className="text-lg text-stone-500">See what our community is saying about their new smiles.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                    <Quote className="absolute top-8 right-8 text-primary/10" size={48} />
                    <div className="flex items-center gap-4 mb-6">
                        <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <div className="font-bold text-stone-900">{t.name}</div>
                            <div className="text-xs text-stone-400 font-medium uppercase tracking-wide">{t.location}</div>
                        </div>
                    </div>
                    <p className="text-stone-600 leading-relaxed italic">"{t.text}"</p>
                    <div className="flex gap-1 mt-6 text-yellow-400">
                        {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                </div>
            ))}
          </div>
      </section>

      {/* Gallery Section - Scrolling Images */}
      <section className="py-16 md:py-24 overflow-hidden bg-stone-50">
        <div className="mb-12 text-center px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4">Real Results</h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">See the amazing transformations from our community</p>
        </div>
        
        {/* Infinite Scrolling Gallery - Single Row */}
        <div className="relative">
          <div className="flex gap-4 animate-scroll-left">
            {HERO_EXAMPLES.map((example, idx) => (
              <div key={`gallery-${idx}`} className="flex-shrink-0 w-64 md:w-80 h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src={example.after} 
                  alt={`Result ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {HERO_EXAMPLES.map((example, idx) => (
              <div key={`gallery-dup-${idx}`} className="flex-shrink-0 w-64 md:w-80 h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src={example.after} 
                  alt={`Result ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="features" className="px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
                { icon: <Zap size={24} />, title: "Instant", desc: "< 30 Seconds" },
                { icon: <Sparkles size={24} />, title: "AI-Powered", desc: "99% Accuracy" },
                { icon: <Smartphone size={24} />, title: "Mobile Ready", desc: "Works everywhere" },
                { icon: <DollarSign size={24} />, title: "100% Free", desc: "No Credit Card" }
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-stone-100 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-4">
                        {item.icon}
                    </div>
                    <h4 className="font-bold text-lg text-stone-900 mb-1">{item.title}</h4>
                    <p className="text-stone-500 text-sm font-medium">{item.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Video Section - Wow Effect */}
      <VideoSection onOpenForm={onOpenForm} />

      {/* FAQ Section - Footer'ın hemen üstü */}
      <FAQ />

      {/* Bottom CTA */}
      <section className="px-6 mb-8 mt-12">
        <div className="max-w-7xl mx-auto bg-primary rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
           
          <h2 className="text-4xl md:text-6xl font-semibold mb-8 relative z-10">Ready to Transform?</h2>
          <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto relative z-10">
            Join 10,000+ happy smiles. It takes less than a minute and it's completely free.
          </p>
          <Button onClick={onStart} variant="secondary" size="lg" className="relative z-10 px-12 py-6 text-xl font-bold hover:scale-105">
            Try It Free Now
          </Button>
        </div>
      </section>
    </div>
  );
};
