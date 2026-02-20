import React, { useState, useEffect, useRef } from 'react';
import { usePresentation } from '../contexts/PresentationContext';
import ChartRenderer from './ChartRenderer';

const PresenterMode = ({ isActive, onExit }) => {
   const { slides, currentSlide, setCurrentSlide } = usePresentation();
   const [startTime, setStartTime] = useState(null);
   const [elapsedTime, setElapsedTime] = useState(0);
   const [showThumbnails, setShowThumbnails] = useState(false);
   const [isDrawing, setIsDrawing] = useState(false);
   const [drawingPath, setDrawingPath] = useState([]);
   const [screenMode, setScreenMode] = useState('normal'); // 'normal', 'black', 'white'
   const [animationState, setAnimationState] = useState({ active: false, animations: [], currentIndex: 0 });
   const [isFullscreen, setIsFullscreen] = useState(false);
   const canvasRef = useRef(null);
   const timerRef = useRef(null);
   const animationTimeoutRef = useRef(null);
   const presenterRef = useRef(null);

  const slide = slides[currentSlide] || {};

  // Animation system for presenter mode
  const getAnimationStyle = (target) => {
    if (!animationState.active) return { className: '', style: {} };

    const animation = animationState.animations.find(a => a.target === target);
    if (!animation) return { className: '', style: {} };

    return {
      className: `animate-${animation.type}`,
      style: {
        animationDuration: `${animation.duration}ms`,
        animationDelay: `${animation.delay}ms`,
        animationFillMode: 'forwards'
      }
    };
  };

  const getTransitionTransform = (transition, direction) => {
    const transforms = {
      fade: direction === 'enter' ? 'scale(0.95)' : 'scale(1.05)',
      push: direction === 'enter' ? 'translateX(100%)' : 'translateX(-100%)',
      wipe: direction === 'enter' ? 'translateY(100%)' : 'translateY(-100%)',
      split: direction === 'enter' ? 'scaleX(0)' : 'scaleX(1)',
      reveal: direction === 'enter' ? 'translateX(-100%) scale(0.8)' : 'translateX(100%) scale(0.8)',
      cover: direction === 'enter' ? 'translateY(-100%)' : 'translateY(100%)',
      flash: direction === 'enter' ? 'scale(1.2)' : 'scale(0.8)'
    };
    return transforms[transition] || 'translateX(100%)';
  };

  const triggerAnimations = () => {
    const animations = slide.animations || [];
    if (animations.length === 0) return;

    // Sort animations by order
    const sortedAnimations = [...animations].sort((a, b) => a.order - b.order);

    setAnimationState({ active: true, animations: sortedAnimations, currentIndex: 0 });

    // Calculate total animation time and reset
    const totalTime = Math.max(...sortedAnimations.map(a => a.delay + a.duration)) + 500;
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationTimeoutRef.current = setTimeout(() => {
      setAnimationState({ active: false, animations: [], currentIndex: 0 });
    }, totalTime);
  };

  // Fullscreen functions with cross-browser support
  const enterFullscreen = async () => {
    if (!presenterRef.current) return;
    
    try {
      if (presenterRef.current.requestFullscreen) {
        await presenterRef.current.requestFullscreen();
      } else if (presenterRef.current.webkitRequestFullscreen) {
        await presenterRef.current.webkitRequestFullscreen();
      } else if (presenterRef.current.mozRequestFullScreen) {
        await presenterRef.current.mozRequestFullScreen();
      } else if (presenterRef.current.msRequestFullscreen) {
        await presenterRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      setIsFullscreen(false);
    } catch (error) {
      console.warn('Exit fullscreen failed:', error);
    }
  };

  const handleExit = async () => {
    if (isFullscreen) {
      await exitFullscreen();
    }
    onExit();
  };

  useEffect(() => {
    if (isActive && !startTime) {
      setStartTime(Date.now());
      // Auto-enter fullscreen when presenter mode starts
      setTimeout(() => enterFullscreen(), 100);
    }
  }, [isActive, startTime]);

  // Auto-enter fullscreen when presenter mode becomes active
  useEffect(() => {
    if (isActive) {
      enterFullscreen();
    }
  }, [isActive]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Handle slide transitions and animations
  useEffect(() => {
    if (isActive && slides[currentSlide]) {
      const slide = slides[currentSlide];
      const slideElement = presenterRef.current?.querySelector('.slide-content');

      if (slideElement) {
        if (slide?.transition && slide.transition !== 'none') {
          slideElement.style.opacity = '0';
          slideElement.style.transform = getTransitionTransform(slide.transition, 'enter');

          setTimeout(() => {
            slideElement.style.transition = `all ${slide.transitionDuration || 1}s ease-in-out`;
            slideElement.style.opacity = '1';
            slideElement.style.transform = 'none';
          }, 50);
        } else {
          slideElement.style.transition = 'none';
          slideElement.style.opacity = '1';
          slideElement.style.transform = 'none';
        }
      }
      triggerAnimations();
    }
  }, [currentSlide, isActive]);

  useEffect(() => {
    if (startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [startTime]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      // Prevent default behavior for presentation keys
      if (['ArrowRight', 'ArrowLeft', ' ', 'Enter', 'Escape', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }

      switch (e.key) {
        case 'Escape':
          handleExit();
          break;
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          if (currentSlide < slides.length - 1) {
            const nextSlide = slides[currentSlide + 1];
            if (nextSlide?.transition) {
              console.log(`Applying ${nextSlide.transition} transition`);
            }
            setCurrentSlide(currentSlide + 1);
          }
          break;
        case 'ArrowLeft':
          if (currentSlide > 0) {
            const prevSlide = slides[currentSlide - 1];
            if (prevSlide?.transition) {
              console.log(`Applying ${prevSlide.transition} transition`);
            }
            setCurrentSlide(currentSlide - 1);
          }
          break;
        case 'Home':
          setCurrentSlide(0);
          break;
        case 'End':
          setCurrentSlide(slides.length - 1);
          break;
        case 't':
        case 'T':
          e.preventDefault();
          setShowThumbnails(!showThumbnails);
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          setScreenMode(screenMode === 'black' ? 'normal' : 'black');
          break;
        case 'w':
        case 'W':
          e.preventDefault();
          setScreenMode(screenMode === 'white' ? 'normal' : 'white');
          break;
      }
    };

    // Use capture phase to ensure we get events first
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isActive, currentSlide, slides.length, setCurrentSlide, handleExit, showThumbnails, screenMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCanvasMouseDown = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDrawingPath([{ x, y }]);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || drawingPath.length === 0) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDrawingPath(prev => [...prev, { x, y }]);
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing) {
      // Keep the drawing for a few seconds then clear
      setTimeout(() => setDrawingPath([]), 3000);
    }
  };

  if (!isActive) return null;

  return (
    <div ref={presenterRef} className="fixed inset-0 bg-black z-50" style={{ transform: isFullscreen ? 'scale(1)' : 'scale(1)' }}>
      {/* Main Slide Display */}
      <div className="relative w-full h-full flex">
        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            className={`slide-content w-full h-full max-w-7xl max-h-full flex items-center justify-center rounded-lg shadow-2xl ${
              screenMode === 'black' ? 'bg-black' :
              screenMode === 'white' ? 'bg-white' : ''
            }`}
            style={{
              backgroundColor: screenMode === 'normal' ? (slide.background || '#ffffff') : undefined,
              aspectRatio: '16/9',
              maxWidth: isFullscreen ? '100vw' : '100%',
              maxHeight: isFullscreen ? '100vh' : '100%'
            }}
          >
            <div className="w-full h-full relative">
              {/* Layout-aware slide content */}
              {screenMode === 'normal' && (() => {
                const layoutType = (slide.layoutMeta && slide.layoutMeta.type) || slide.layout || 'title-content';

                if (layoutType === 'title-content') {
                  return (
                    <>
                      {slide.title && (
                        <div
                          className={`absolute top-12 left-12 right-12 text-6xl font-bold text-center outline-none ${getAnimationStyle('title').className}`}
                          style={{
                            color: slide.textColor || '#1f2937',
                            ...getAnimationStyle('title').style
                          }}
                          dangerouslySetInnerHTML={{ __html: slide.title }}
                        />
                      )}
                      {slide.content && (
                        <div
                          className={`absolute top-32 left-12 right-12 bottom-12 text-3xl outline-none ${getAnimationStyle('content').className}`}
                          style={{
                            color: slide.textColor || '#374151',
                            ...getAnimationStyle('content').style
                          }}
                          dangerouslySetInnerHTML={{ __html: slide.content }}
                        />
                      )}
                    </>
                  );
                }

                if (layoutType === 'title-only') {
                  return slide.title && (
                    <div
                      className={`absolute top-24 left-12 right-12 text-6xl font-bold text-center outline-none ${getAnimationStyle('title').className}`}
                      style={{
                        color: slide.textColor || '#1f2937',
                        ...getAnimationStyle('title').style
                      }}
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                    />
                  );
                }

                if (layoutType === 'content-only') {
                  return slide.content && (
                    <div
                      className={`absolute top-16 left-12 right-12 bottom-12 text-3xl outline-none ${getAnimationStyle('content').className}`}
                      style={{
                        color: slide.textColor || '#374151',
                        ...getAnimationStyle('content').style
                      }}
                      dangerouslySetInnerHTML={{ __html: slide.content }}
                    />
                  );
                }

                if (layoutType === 'two-column') {
                  return (
                    <div className="absolute inset-0 pt-20 px-12 pb-12 grid grid-cols-2 gap-6">
                      <div
                        className="text-3xl outline-none"
                        style={{ color: slide.textColor || '#374151' }}
                        dangerouslySetInnerHTML={{ __html: slide.contentLeft || '' }}
                      />
                      <div
                        className="text-3xl outline-none"
                        style={{ color: slide.textColor || '#374151' }}
                        dangerouslySetInnerHTML={{ __html: slide.contentRight || '' }}
                      />
                    </div>
                  );
                }

                if (layoutType === 'image-text') {
                  return (
                    <div className="absolute inset-0 pt-16 px-12 pb-12 grid grid-cols-2 gap-6">
                      <div className="relative flex items-center justify-center rounded-xl border border-gray-300 overflow-hidden">
                        {slide.imageSrc ? (
                          <img src={slide.imageSrc} alt="Slide" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <div className="text-gray-500">Image</div>
                        )}
                      </div>
                      <div
                        className="text-3xl outline-none"
                        style={{ color: slide.textColor || '#374151' }}
                        dangerouslySetInnerHTML={{ __html: slide.content || '' }}
                      />
                    </div>
                  );
                }

                if (layoutType === 'comparison') {
                  return (
                    <div className="absolute inset-0 pt-12 px-12 pb-12 grid grid-cols-2 gap-6">
                      <div>
                        {slide.compLeftTitle && (
                          <div
                            className="text-4xl font-semibold outline-none mb-4 text-center"
                            style={{ color: slide.textColor || '#1f2937' }}
                            dangerouslySetInnerHTML={{ __html: slide.compLeftTitle }}
                          />
                        )}
                        {slide.compLeftContent && (
                          <div
                            className="text-2xl outline-none"
                            style={{ color: slide.textColor || '#374151' }}
                            dangerouslySetInnerHTML={{ __html: slide.compLeftContent }}
                          />
                        )}
                      </div>
                      <div>
                        {slide.compRightTitle && (
                          <div
                            className="text-4xl font-semibold outline-none mb-4 text-center"
                            style={{ color: slide.textColor || '#1f2937' }}
                            dangerouslySetInnerHTML={{ __html: slide.compRightTitle }}
                          />
                        )}
                        {slide.compRightContent && (
                          <div
                            className="text-2xl outline-none"
                            style={{ color: slide.textColor || '#374151' }}
                            dangerouslySetInnerHTML={{ __html: slide.compRightContent }}
                          />
                        )}
                      </div>
                    </div>
                  );
                }

                return null;
              })()}

              {/* Render dynamic elements */}
              {screenMode === 'normal' && slide.elements && slide.elements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute ${getAnimationStyle(element.id).className}`}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    fontSize: `${element.fontSize}px`,
                    fontFamily: element.fontFamily,
                    color: element.color,
                    backgroundColor: element.backgroundColor,
                    border: element.borderWidth ? `${element.borderWidth}px ${element.borderStyle || 'solid'} ${element.borderColor || '#000000'}` : 'none',
                    ...getAnimationStyle(element.id).style
                  }}
                >
                  {element.type === 'textbox' && (
                    <div
                      className="w-full h-full outline-none p-1 cursor-text"
                      dangerouslySetInnerHTML={{ __html: element.content }}
                    />
                  )}

                  {element.type === 'image' && element.src && (
                    <img
                      src={element.src}
                      alt={element.alt}
                      className="w-full h-full object-cover"
                      style={{
                        opacity: element.opacity || 1,
                        filter: `brightness(${element.brightness || 1}) contrast(${element.contrast || 1})`,
                        borderRadius: `${element.borderRadius || 0}px`
                      }}
                      draggable={false}
                    />
                  )}

                  {element.type === 'shape' && (
                    <div className="w-full h-full">
                      {element.shapeType === 'rectangle' && (
                        <div
                          className="w-full h-full rounded"
                          style={{
                            backgroundColor: element.fill,
                            border: element.stroke ? `${element.strokeWidth || 1}px solid ${element.stroke}` : 'none'
                          }}
                        />
                      )}
                      {element.shapeType === 'circle' && (
                        <div
                          className="w-full h-full rounded-full"
                          style={{
                            backgroundColor: element.fill,
                            border: element.stroke ? `${element.strokeWidth || 1}px solid ${element.stroke}` : 'none'
                          }}
                        />
                      )}
                      {element.shapeType === 'triangle' && (
                        <div
                          className="w-full h-full flex items-center justify-center text-6xl"
                          style={{ color: element.fill }}
                        >
                          🔺
                        </div>
                      )}
                      {element.shapeType === 'square' && (
                        <div
                          className="w-full h-full rounded"
                          style={{
                            backgroundColor: element.fill,
                            border: element.stroke ? `${element.strokeWidth || 1}px solid ${element.stroke}` : 'none'
                          }}
                        />
                      )}
                      {element.shapeType === 'oval' && (
                        <div
                          className="w-full h-full rounded-full"
                          style={{
                            backgroundColor: element.fill,
                            border: element.stroke ? `${element.strokeWidth || 1}px solid ${element.stroke}` : 'none'
                          }}
                        />
                      )}
                      {element.shapeType === 'star' && (
                        <div
                          className="w-full h-full flex items-center justify-center text-6xl"
                          style={{ color: element.fill }}
                        >
                          ⭐
                        </div>
                      )}
                      {element.shapeType === 'arrow' && (
                        <div
                          className="w-full h-full flex items-center justify-center text-4xl"
                          style={{ color: element.fill }}
                        >
                          →
                        </div>
                      )}
                      {element.shapeType === 'line' && (
                        <div
                          className="w-full h-full flex items-center justify-center"
                        >
                          <div
                            className="w-full"
                            style={{
                              height: `${element.strokeWidth || 2}px`,
                              backgroundColor: element.stroke || '#000000'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {element.type === 'chart' && (
                    <div className="w-full h-full relative">
                      <ChartRenderer element={element} />
                    </div>
                  )}

                  {element.type === 'table' && (
                    <div className="w-full h-full overflow-hidden relative">
                      <table className="w-full h-full text-xs border-collapse border border-gray-300">
                        <tbody>
                          {element.data.map((row, i) => (
                            <tr key={i}>
                              {row.map((cell, j) => (
                                <td
                                  key={j}
                                  className="border border-gray-300 p-1"
                                  style={{
                                    backgroundColor: element.cellColors?.[i]?.[j] || element.backgroundColor || 'transparent'
                                  }}
                                >
                                  {cell || `${i + 1},${j + 1}`}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}


                  {element.type === 'equation' && (
                    <div
                      className="w-full h-full flex items-center justify-center p-2 border-2 border-gray-300 bg-white rounded"
                      style={{
                        fontSize: element.fontSize,
                        fontFamily: element.fontFamily,
                        color: element.color,
                        backgroundColor: element.backgroundColor || '#ffffff'
                      }}
                    >
                      <div className="text-center p-2">
                        {element.content || 'E = mc²'}
                      </div>
                    </div>
                  )}

                  {element.type === 'icon' && (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ fontSize: element.fontSize, color: element.color }}
                    >
                      {element.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawing Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ pointerEvents: isDrawing ? 'auto' : 'none' }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
        />

        {/* Drawing Path */}
        {drawingPath.length > 1 && (
          <svg className="absolute inset-0 pointer-events-none">
            <path
              d={`M ${drawingPath[0].x} ${drawingPath[0].y} ${drawingPath.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
              stroke="red"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Presenter Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (currentSlide > 0) {
                  setCurrentSlide(currentSlide - 1);
                }
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded transition-colors"
              disabled={currentSlide === 0}
            >
              ← Previous
            </button>
            <span className="text-lg font-medium">
              {currentSlide + 1} of {slides.length}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (currentSlide < slides.length - 1) {
                  setCurrentSlide(currentSlide + 1);
                }
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded transition-colors"
              disabled={currentSlide === slides.length - 1}
            >
              Next →
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              Time: {formatTime(elapsedTime)}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleExit();
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition-colors"
            >
              Exit Presenter
            </button>
          </div>
        </div>
      </div>

      {/* Speaker Notes Panel */}
      <div className="absolute right-0 top-0 bottom-16 w-80 bg-gray-900 text-white p-4 overflow-y-auto">
        <h3 className="text-lg font-medium mb-2">Speaker Notes</h3>
        <div className="text-sm text-gray-300 mb-4">
          {slide.notes || 'No notes for this slide.'}
        </div>

        <h4 className="text-md font-medium mb-2">Next Slide Preview</h4>
        {currentSlide < slides.length - 1 && (
          <div className="bg-gray-800 p-2 rounded text-xs">
            <div className="font-medium mb-1">{slides[currentSlide + 1].title || 'Untitled'}</div>
            <div className="text-gray-400 line-clamp-2">
              {slides[currentSlide + 1].content ? slides[currentSlide + 1].content.replace(/<[^>]*>/g, '') : 'No content'}
            </div>
          </div>
        )}
      </div>

      {/* Slide Thumbnails Panel */}
      {showThumbnails && (
        <div className="absolute left-0 top-0 bottom-16 w-64 bg-gray-900 text-white p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">Slide Thumbnails</h3>
          <div className="space-y-2">
            {slides.map((thumbSlide, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
                className={`w-full text-left p-2 rounded transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="text-xs font-medium">
                  {index + 1}. {thumbSlide.title || 'Untitled'}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {thumbSlide.content ? thumbSlide.content.replace(/<[^>]*>/g, '').substring(0, 30) : 'No content'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs p-2 rounded">
        <div>Space/→: Next • ←: Previous • Esc: Exit</div>
        <div>Home: First • End: Last</div>
      </div>
    </div>
  );
};

export default PresenterMode;