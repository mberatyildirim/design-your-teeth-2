// Video Section Component - Wow effect oluşturan video bölümü

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer - video görünür olduğunda otomatik oynat
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Video görünür olduğunda otomatik oynat (muted)
            if (videoRef.current) {
              videoRef.current.play().catch(() => {
                // Autoplay blocked, user interaction required
              });
              setIsPlaying(true);
            }
          } else {
            // Video görünmez olduğunda duraklat
            if (videoRef.current) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-primary/5 to-stone-50"></div>
      
      {/* Decorative Elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold tracking-wide border border-primary/10">
            <Play size={14} className="fill-primary" />
            <span>See It In Action</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-stone-900">
            Transform Your Smile
            <br />
            <span className="text-primary">In Seconds</span>
          </h2>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto">
            Watch how our AI technology creates your perfect smile in real-time
          </p>
        </div>

        {/* Video Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Video Wrapper with rounded corners and shadow */}
          <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-stone-200 bg-stone-900">
            <video
              ref={videoRef}
              src="/video.mp4"
              className="w-full h-auto"
              loop
              muted={isMuted}
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="absolute bottom-6 left-6 w-14 h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 group"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={24} className="text-stone-900 md:w-7 md:h-7" />
              ) : (
                <Play size={24} className="text-stone-900 md:w-7 md:h-7 ml-1" fill="currentColor" />
              )}
            </button>

            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX size={24} className="text-stone-900 md:w-7 md:h-7" />
              ) : (
                <Volume2 size={24} className="text-stone-900 md:w-7 md:h-7" />
              )}
            </button>

            {/* Video Info Badge */}
            <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
              AI-Powered Smile Design
            </div>
          </div>

          {/* Stats Cards Below Video */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mt-8">
            {[
              { label: 'Users', value: '10K+' },
              { label: 'Smiles', value: '50K+' },
              { label: 'Satisfaction', value: '99%' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 md:p-6 text-center shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-stone-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

