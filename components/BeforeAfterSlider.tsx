
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Container genişliğini hesapla ve güncelle
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // İlk render'da ve image'lar değiştiğinde genişliği hesapla
    updateWidth();
    const timeoutId = setTimeout(updateWidth, 100);

    // Resize event listener
    window.addEventListener('resize', updateWidth);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateWidth);
    };
  }, [beforeImage, afterImage]);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onTouchStart = () => setIsDragging(true);

  const onMouseUp = () => setIsDragging(false);
  const onTouchEnd = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, []);

  return (
    <div 
      className="relative w-full aspect-square rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-2xl border-4 border-white ring-1 ring-stone-100"
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
    >
      {/* After Image (Background) - Full container, always visible */}
      <div className="absolute inset-0 w-full h-full">
      <img 
        src={afterImage} 
        alt="After" 
          className="w-full h-full object-cover" 
          style={{ objectPosition: 'center' }}
          onLoad={() => {
            // Image yüklendiğinde container genişliğini güncelle
            if (containerRef.current) {
              setContainerWidth(containerRef.current.offsetWidth);
            }
          }}
      />
      </div>
      
      <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm z-10 shadow-lg">
        Result
      </div>

      {/* Before Image (Clipped on left) - Container genişliğine göre ayarlanmış */}
      <div 
        className="absolute inset-0 h-full overflow-hidden" 
        style={{ width: `${sliderPosition}%` }}
      >
        <div 
          className="absolute inset-0"
          style={{ 
            width: containerWidth > 0 ? `${containerWidth}px` : '100%',
            minWidth: '100%'
          }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
            className="w-full h-full object-cover" 
            style={{ objectPosition: 'center' }}
            onLoad={() => {
              // Image yüklendiğinde container genişliğini güncelle
              if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
              }
            }}
        />
        </div>
        <div className="absolute top-4 left-4 bg-stone-900/60 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-lg z-10">
          Original
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white/80 backdrop-blur-sm z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-primary transform hover:scale-110 transition-transform">
          <MoveHorizontal size={24} />
        </div>
      </div>
    </div>
  );
};
