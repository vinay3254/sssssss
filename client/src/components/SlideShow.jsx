import React, { useState, useEffect } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const SlideShow = ({ isActive, onExit }) => {
  const { slides, currentSlide, setCurrentSlide } = usePresentation();
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onExit();
          break;
        case 'ArrowRight':
        case ' ':
          if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
          }
          break;
        case 'ArrowLeft':
          if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentSlide, slides.length, setCurrentSlide, onExit]);

  if (!isActive) return null;

  const slide = slides[currentSlide] || {};

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div 
        className="w-full h-full flex items-center justify-center p-8"
        style={{ backgroundColor: slide.background || '#ffffff' }}
      >
        <div className="max-w-6xl w-full h-full flex flex-col justify-center">
          {slide.title && (
            <h1 
              className="text-6xl font-bold text-center mb-8"
              style={{ color: slide.textColor || '#000000' }}
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />
          )}
          {slide.content && (
            <div 
              className="text-2xl text-center"
              style={{ color: slide.textColor || '#000000' }}
              dangerouslySetInnerHTML={{ __html: slide.content }}
            />
          )}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-lg p-2 flex items-center gap-2">
          <button
            onClick={() => currentSlide > 0 && setCurrentSlide(currentSlide - 1)}
            className="text-white p-2 hover:bg-white/20 rounded"
            disabled={currentSlide === 0}
          >
            ←
          </button>
          <span className="text-white text-sm px-2">
            {currentSlide + 1} / {slides.length}
          </span>
          <button
            onClick={() => currentSlide < slides.length - 1 && setCurrentSlide(currentSlide + 1)}
            className="text-white p-2 hover:bg-white/20 rounded"
            disabled={currentSlide === slides.length - 1}
          >
            →
          </button>
          <button
            onClick={onExit}
            className="text-white p-2 hover:bg-white/20 rounded ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default SlideShow;