import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = () => {
  const { slides, currentSlide, setCurrentSlide, addSlide, deleteSlide, duplicateSlide, reorderSlides } = usePresentation();
  const { isDark } = useTheme();
  const [draggedSlide, setDraggedSlide] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(null);

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
    setShowContextMenu(null);
  };

  const handleRightClick = (e, index) => {
    e.preventDefault();
    setShowContextMenu(index);
  };

  const handleDragStart = (e, index) => {
    setDraggedSlide(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedSlide !== null && draggedSlide !== dropIndex) {
      reorderSlides(draggedSlide, dropIndex);
    }
    setDraggedSlide(null);
    setHoverIndex(null);
  };

  return (
    <>
      <style>{`
        .slides-container::-webkit-scrollbar {
          width: 8px;
        }
        .slides-container::-webkit-scrollbar-track {
          background: ${isDark ? '#374151' : '#f3f4f6'};
          border-radius: 4px;
        }
        .slides-container::-webkit-scrollbar-thumb {
          background: ${isDark ? '#4b5563' : '#d1d5db'};
          border-radius: 4px;
        }
        .slides-container::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#6b7280' : '#9ca3af'};
        }
      `}</style>
      <div className="sidebar scrollbar-thin" style={{ backgroundColor: isDark ? '#1B1A17' : '#ffffff' }}>
      {/* Header */}
      <div className="p-4" style={{ borderBottom: `1px solid ${isDark ? '#F0A500' : '#E5E7EB'}` }}>
        <div className="flex items-center justify-between mb-4">
          {/* Themed header title uses nav-title for consistent styling */}
          <h3 className="text-lg font-semibold nav-title">Slides</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addSlide()}
              className="btn-secondary flex items-center justify-center gap-1 px-2 py-1"
              title="Add New Slide"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[10px] font-medium">Add Slide</span>
            </button>
          </div>
        </div>
        
        {/* Slide Counter */}
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {slides.length} slide{slides.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Slides List */}
      <div 
        className="slides-container flex-1 p-2 space-y-2 overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: isDark ? '#4b5563 #374151' : '#d1d5db #f3f4f6'
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`relative group cursor-pointer transition-all duration-200 ${
              currentSlide === index
                ? 'ring-2 ring-primary-500 shadow-glow'
                : 'hover:shadow-medium'
            }`}
            onClick={() => handleSlideClick(index)}
            onContextMenu={(e) => handleRightClick(e, index)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => { handleDragOver(e); setHoverIndex(index); }}
            onDrop={(e) => handleDrop(e, index)}
          >
            {/* Slide Thumbnail - switched to themed class for consistent look */}
            <div className={`slide-thumbnail ${currentSlide === index ? 'selected' : ''} ${hoverIndex === index && draggedSlide !== null ? 'ring-2 ring-primary-400' : ''}`}>
              {/* Slide Number */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                  {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  {currentSlide === index && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse-soft"></div>
                  )}
                  {(slide.animations && slide.animations.length > 0) && (
                    <div className="text-[10px]" title="Has animations">★</div>
                  )}
                </div>
              </div>
              
              {/* Slide Preview */}
              {(() => {
                const previewBg = slide.background || (isDark ? '#1B1A17' : '#F9FAFB');
                const borderColor = isDark ? 'rgba(240, 165, 0, 0.3)' : '#E5E7EB';

                // Helper: determine if a hex color is light
                const isHexLight = (hex) => {
                  try {
                    const h = hex.replace('#', '');
                    const r = parseInt(h.length === 3 ? h[0] + h[0] : h.substring(0,2), 16);
                    const g = parseInt(h.length === 3 ? h[1] + h[1] : h.substring(h.length===3?1:2, h.length===3?2:4), 16);
                    const b = parseInt(h.length === 3 ? h[2] + h[2] : h.substring(h.length===3?2:4, h.length===3?3:6), 16);
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    return brightness > 180;
                  } catch (e) {
                    return false;
                  }
                };

                const useLightText = isDark && !isHexLight(previewBg.replace(/\s+/g, '').toLowerCase());
                const titleColor = useLightText ? '#FFFFFF' : (isDark ? '#1F2937' : '#1F2937');
                const contentColor = useLightText ? '#E5E7EB' : (isDark ? '#6B7280' : '#6B7280');

                return (
                  <div
                    className={`aspect-video rounded-lg p-2 text-sm overflow-y-auto ${slide.patternClass || ''}`}
                    style={{
                      backgroundColor: previewBg,
                      border: `1px solid ${borderColor}`
                    }}
                  >
                    {/* Title Preview */}
                    {slide.title && (
                      <div
                        className="font-semibold mb-0.5 text-[10px]"
                        style={{ color: titleColor }}
                        dangerouslySetInnerHTML={{ __html: slide.title.replace(/<[^>]*>/g, '') }}
                      />
                    )}

                    {/* Content Preview */}
                    {slide.content && (
                      <div
                        className="text-[9px] leading-tight"
                        style={{ color: contentColor }}
                        dangerouslySetInnerHTML={{ __html: slide.content.replace(/<[^>]*>/g, '') }}
                      />
                    )}

                    {/* Elements Preview */}
                    {slide.elements && slide.elements.length > 0 && (
                      <div className="mt-1 flex gap-1">
                        {slide.elements.slice(0, 3).map((element, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-primary-400 rounded-sm"
                            title={element.type}
                          ></div>
                        ))}
                        {slide.elements.length > 3 && (
                          <div className="text-xs text-neutral-400">+{slide.elements.length - 3}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            
            {/* Hover Actions */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowContextMenu(showContextMenu === index ? null : index);
                }}
                className="btn-ghost rounded"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
            
            {/* Context Menu */}
            {showContextMenu === index && (
              <div className="absolute top-8 right-2 dropdown-menu z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSlide(index);
                    setShowContextMenu(null);
                  }}
                  className="dropdown-item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Duplicate
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (slides.length > 1) {
                      deleteSlide(index);
                    }
                    setShowContextMenu(null);
                  }}
                  className="dropdown-item text-red-600 dark:text-red-400"
                  disabled={slides.length <= 1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
        
        {/* Add Slide Button */}
      </div>
      
      {/* Click outside to close context menu */}
      {showContextMenu !== null && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowContextMenu(null)}
        ></div>
      )}
    </div>
    </>
  );
};

export default Sidebar;