
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePresentation } from '../contexts/PresentationContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ChartComponent from './ChartComponent';
import ChartRenderer from './ChartRenderer';
import TableComponent from './TableComponent';
import HeaderFooterModal from './HeaderFooterModal';
import ImageEditor from './ImageEditor';
import AdvancedTableEditor from './AdvancedTableEditor';
import TextFormattingRibbon from './TextFormattingRibbon';

const SlideEditor = ({ onTableSelect, onTableCellSelect, showGridlines = true, snapToGrid = false, zoomLevel = 100 }) => {
  const { slides, currentSlide, updateSlide, presentationMeta, setPresentationMeta, animationPreview, selectedAnimation, addSlide } = usePresentation();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [selectedElement, setSelectedElement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [originalPosition, setOriginalPosition] = useState(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const [editChartIndex, setEditChartIndex] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showHeaderFooter, setShowHeaderFooter] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, elementId: null });
  const [elementClipboard, setElementClipboard] = useState(null);
  const [selectedBullet, setSelectedBullet] = useState(null);
  const [showBulletMenu, setShowBulletMenu] = useState(false);
  const [bulletMenuPosition, setBulletMenuPosition] = useState({ x: 0, y: 0 });
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [shapeMenuPosition, setShapeMenuPosition] = useState({ x: 0, y: 0 });
  const [showIconMenu, setShowIconMenu] = useState(false);
  const [iconMenuPosition, setIconMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedTableCell, setSelectedTableCell] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [isEditingLeftContent, setIsEditingLeftContent] = useState(false);
  const [isEditingRightContent, setIsEditingRightContent] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 960, height: 540 });
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const updateTimerRef = useRef(null);

  const slide = slides[currentSlide] || {};
  const layoutType = (slide.layoutMeta && slide.layoutMeta.type) || slide.layout || 'title-content';

  // Responsive canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const aspectRatio = 16 / 9;
      
      let width, height;
      if (containerWidth / containerHeight > aspectRatio) {
        height = containerHeight;
        width = height * aspectRatio;
      } else {
        width = containerWidth;
        height = width / aspectRatio;
      }
      
      setCanvasSize({ width, height });
    };

    updateCanvasSize();
    const timeoutId = setTimeout(updateCanvasSize, 100);
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);


  


  // Force re-render when layout changes
  useEffect(() => {
    setIsEditing(false);
    setSelectedElement(null);
  }, [layoutType, currentSlide]);

  // Handle contentEditable content updates - only when slide changes
  useEffect(() => {
    if (titleRef.current && !titleRef.current.contains(document.activeElement)) {
      titleRef.current.innerHTML = slide.title || 'Click to add title';
    }
  }, [currentSlide]);

  useEffect(() => {
    if (contentRef.current && !contentRef.current.contains(document.activeElement)) {
      contentRef.current.innerHTML = slide.content || 'Click to add content';
    }
  }, [currentSlide]);

  useEffect(() => {
    if (leftContentRef.current && !leftContentRef.current.contains(document.activeElement)) {
      leftContentRef.current.innerHTML = slide.leftContent || 'Click to add content';
    }
  }, [currentSlide]);

  useEffect(() => {
    if (rightContentRef.current && !rightContentRef.current.contains(document.activeElement)) {
      rightContentRef.current.innerHTML = slide.rightContent || 'Click to add content';
    }
  }, [currentSlide]);

  // Global keyboard listener for Enter key to add new slide
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle Enter key, don't interfere with other keys
      if (e.key !== 'Enter') return;
      
      // Check if we're currently editing any content
      const activeElement = document.activeElement;
      const isInEditableContent = 
        activeElement.contentEditable === 'true' || 
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable;
      
      // Only add new slide if NOT in editable content
      if (!isInEditableContent) {
        e.preventDefault();
        setSelectedElement(null);
        setIsDragging(false);
        setIsResizing(false);
        setTimeout(() => {
          addSlide('title-content');
        }, 0);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [addSlide]);

  // Global mouse handlers for dragging/resizing selected elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!selectedElement) return;
      const el = (slide.elements || []).find(x => x.id === selectedElement);
      if (!el) return;
      const canvas = document.querySelector('.slide-canvas');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (isDragging) {
        const newX = mouseX - dragOffset.x;
        const newY = mouseY - dragOffset.y;
        updateElement(el.id, { x: Math.max(0, newX), y: Math.max(0, newY) });
      } else if (isResizing && resizeHandle) {
        const deltaX = mouseX - resizeStart.mouseX;
        const deltaY = mouseY - resizeStart.mouseY;
        let newW = resizeStart.width;
        let newH = resizeStart.height;
        let newX = resizeStart.elX;
        let newY = resizeStart.elY;

        switch (resizeHandle) {
          case 'nw':
            newW = Math.max(30, resizeStart.width - deltaX);
            newH = Math.max(30, resizeStart.height - deltaY);
            newX = resizeStart.elX + (resizeStart.width - newW);
            newY = resizeStart.elY + (resizeStart.height - newH);
            break;
          case 'ne':
            newW = Math.max(30, resizeStart.width + deltaX);
            newH = Math.max(30, resizeStart.height - deltaY);
            newY = resizeStart.elY + (resizeStart.height - newH);
            break;
          case 'sw':
            newW = Math.max(30, resizeStart.width - deltaX);
            newH = Math.max(30, resizeStart.height + deltaY);
            newX = resizeStart.elX + (resizeStart.width - newW);
            break;
          case 'se':
            newW = Math.max(30, resizeStart.width + deltaX);
            newH = Math.max(30, resizeStart.height + deltaY);
            break;
          case 'n':
            newH = Math.max(30, resizeStart.height - deltaY);
            newY = resizeStart.elY + (resizeStart.height - newH);
            break;
          case 's':
            newH = Math.max(30, resizeStart.height + deltaY);
            break;
          case 'w':
            newW = Math.max(30, resizeStart.width - deltaX);
            newX = resizeStart.elX + (resizeStart.width - newW);
            break;
          case 'e':
            newW = Math.max(30, resizeStart.width + deltaX);
            break;
        }

        updateElement(el.id, { x: newX, y: newY, width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        setTimeout(() => {
          setIsDragging(false);
          setIsResizing(false);
          setResizeHandle(null);
        }, 0);
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeHandle, dragOffset, resizeStart, selectedElement, slide.elements]);

  // Click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.slide-element') && !e.target.closest('[contenteditable="true"]')) {
        setSelectedElement(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAnimationStyle = (target) => {
    if (!animationPreview.active) return { className: '', style: {} };
    const animations = animationPreview.animations || slide.animations || [];
    const animation = animations.find(a => a.target === target);
    if (!animation) return { className: '', style: {} };
    return {
      className: `animate-${animation.type}`,
      style: {
        '--animation-duration': `${animation.duration || 1000}ms`,
        '--animation-delay': `${animation.delay || 0}ms`
      }
    };
  };

  const updateElement = (elementId, updates, skipHistory = false) => {
    const elements = slide.elements || [];
    const updatedElements = elements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    updateSlide(currentSlide, { elements: updatedElements }, skipHistory);
  };

  const startResize = (e, element, handle) => {
    e.preventDefault();
    e.stopPropagation();
    const canvas = document.querySelector('.slide-canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setSelectedElement(element.id);
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({ 
      mouseX, 
      mouseY, 
      width: element.width || 100, 
      height: element.height || 100, 
      elX: element.x || 0, 
      elY: element.y || 0 
    });
  };

  const handleFormatChange = (formatOptions) => {
    if (selectedElement) {
      updateElement(selectedElement, formatOptions);
    }
  };

  const applyFormatToSelection = (command, value = null) => {
    const selection = window.getSelection();
    
    // Handle text color and highlight color at slide level when no text is selected
    if ((command === 'foreColor' || command === 'backColor') && (!selection || selection.rangeCount === 0 || !selection.toString())) {
      // Apply color to the entire slide's text content
      if (command === 'foreColor') {
        updateSlide(currentSlide, { textColor: value });
      } else if (command === 'backColor') {
        // For highlight, we need to update content with background color
        const slideContent = slide.content || '';
        // Wrap content in a span with background color
        const highlightedContent = `<span style="background-color: ${value}">${slideContent}</span>`;
        updateSlide(currentSlide, { content: highlightedContent });
      }
      return;
    }
    
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const editableElement = container.nodeType === Node.TEXT_NODE
      ? container.parentElement.closest('[contenteditable="true"]')
      : container.closest('[contenteditable="true"]');
    
    if (!editableElement) {
      // If no editable element found, apply at slide level
      if (command === 'foreColor') {
        updateSlide(currentSlide, { textColor: value });
      }
      return;
    }
    
    // Handle alignment
    if (command === 'justifyLeft' || command === 'justifyCenter' || command === 'justifyRight') {
      const alignment = command === 'justifyLeft' ? 'left' : command === 'justifyCenter' ? 'center' : 'right';
      editableElement.style.textAlign = alignment;
      updateSlide(currentSlide, { [editableElement.dataset.field || 'content']: editableElement.innerHTML });
      return;
    }
    
    const selectedText = range.toString();
    
    // For toggle formats (bold, italic, underline, strikethrough), use execCommand for reliable toggle behavior
    if (['bold', 'italic', 'underline', 'strikeThrough'].includes(command)) {
      // Use execCommand for reliable toggle behavior (like Microsoft PowerPoint)
      const execCommand = command === 'bold' ? 'bold' : command === 'italic' ? 'italic' : command === 'underline' ? 'underline' : 'strikeThrough';
      document.execCommand(execCommand);
      
      // Save changes
      updateSlide(currentSlide, { [editableElement.dataset.field || 'content']: editableElement.innerHTML });
      return;
    }
    
    if (!selectedText) {
      if (command === 'fontName') editableElement.style.fontFamily = value;
      if (command === 'fontSize') editableElement.style.fontSize = value + 'px';
      if (command === 'foreColor') {
        editableElement.style.color = value;
        updateSlide(currentSlide, { [editableElement.dataset.field || 'content']: editableElement.innerHTML });
      }
      if (command === 'backColor') {
        editableElement.style.backgroundColor = value;
        updateSlide(currentSlide, { [editableElement.dataset.field || 'content']: editableElement.innerHTML });
      }
      return;
    }
    
    const span = document.createElement('span');
    span.textContent = selectedText;
    
    if (command === 'bold') span.style.fontWeight = 'bold';
    if (command === 'italic') span.style.fontStyle = 'italic';
    if (command === 'underline') span.style.textDecoration = 'underline';
    if (command === 'strikeThrough') span.style.textDecoration = 'line-through';
    if (command === 'fontName') span.style.fontFamily = value;
    if (command === 'fontSize') span.style.fontSize = value + 'px';
    if (command === 'foreColor') span.style.color = value;
    if (command === 'backColor') span.style.backgroundColor = value;
    
    range.deleteContents();
    range.insertNode(span);
    
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    // Save changes to slide
    updateSlide(currentSlide, { [editableElement.dataset.field || 'content']: editableElement.innerHTML });
  };

  const deleteElement = (elementId) => {
    const elements = slide.elements || [];
    const filteredElements = elements.filter(el => el.id !== elementId);
    updateSlide(currentSlide, { elements: filteredElements });
    setSelectedElement(null);
  };

  return (
    <div className="editor-wrapper flex flex-col bg-white dark:bg-black h-full w-full">
      {/* Text Formatting Ribbon */}
      <div className="flex-shrink-0">
        <TextFormattingRibbon 
          selectedElement={selectedElement}
          onFormatChange={handleFormatChange}
          applyFormatToSelection={applyFormatToSelection}
        />
      </div>

      {/* Slide Canvas */}
      <div ref={containerRef} className="flex-1 flex justify-center items-center w-full overflow-hidden">
        <div
          className={`slide-canvas relative overflow-hidden ${slide.patternClass || ''}`}
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            backgroundColor: slide.background || (isDark ? '#000000' : '#ffffff'),
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
        >
            {/* Microsoft PowerPoint Exact Layouts */}
            {layoutType === 'blank' && (
              <div
                ref={contentRef}
                data-field="content"
                contentEditable
                suppressContentEditableWarning={true}
                className="absolute inset-4 text-lg outline-none cursor-text border-2 border-dashed border-gray-300"
                style={{ color: slide.textColor || '#374151' }}
                onBlur={(e) => updateSlide(currentSlide, { content: e.target.innerHTML })}
                onFocus={(e) => {
                  if (e.target.textContent === 'Click to add text') {
                    e.target.innerHTML = '';
                  }
                }}
                dangerouslySetInnerHTML={{ __html: slide.content || 'Click to add text' }}
              />
            )}

            {layoutType === 'title-content' && (
              <>
                <div
                  ref={titleRef}
                  data-field="title"
                  contentEditable
                  suppressContentEditableWarning={true}
                  spellCheck={true}
                  className={`absolute top-4 left-4 right-4 h-16 text-3xl font-bold text-center outline-none cursor-text border-2 border-dashed border-gray-300 flex items-center justify-center ${getAnimationStyle('title').className}`}
                  style={{ color: slide.textColor || '#1f2937', ...getAnimationStyle('title').style }}
                  onBlur={(e) => updateSlide(currentSlide, { title: e.target.innerHTML })}
                  onFocus={(e) => {
                    if (e.target.textContent === 'Click to add title') {
                      e.target.innerHTML = '';
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.title || 'Click to add title' }}
                />
                <div
                  ref={contentRef}
                  data-field="content"
                  contentEditable
                  suppressContentEditableWarning={true}
                  spellCheck={true}
                  className={`absolute top-24 left-4 right-4 bottom-4 text-base outline-none cursor-text border-2 border-dashed border-gray-300 p-3 overflow-hidden ${getAnimationStyle('content').className}`}
                  style={{ color: slide.textColor || '#374151', ...getAnimationStyle('content').style }}
                  onBlur={(e) => updateSlide(currentSlide, { content: e.target.innerHTML })}
                  onFocus={(e) => {
                    if (e.target.textContent === 'Click to add content') {
                      e.target.innerHTML = '';
                    }
                  }}
                  onInput={(e) => {
                    if (e.target.scrollHeight > e.target.clientHeight) {
                      addSlide('title-content');
                      e.target.blur();
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.content || 'Click to add content' }}
                />
              </>
            )}

            {layoutType === 'title-only' && (
              <div
                ref={titleRef}
                contentEditable
                suppressContentEditableWarning={true}
                className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-center outline-none cursor-text border-2 border-dashed border-gray-300"
                style={{ color: slide.textColor || '#1f2937', padding: '60px' }}
                onBlur={(e) => updateSlide(currentSlide, { title: e.target.innerHTML })}
                onFocus={(e) => {
                  if (e.target.textContent === 'Click to add title') {
                    e.target.innerHTML = '';
                  }
                }}
                dangerouslySetInnerHTML={{ __html: slide.title || 'Click to add title' }}
              />
            )}

            {layoutType === 'content-only' && (
              <div
                contentEditable
                suppressContentEditableWarning={true}
                className="absolute inset-4 text-lg outline-none cursor-text border-2 border-dashed border-gray-300 p-4"
                style={{ color: slide.textColor || '#374151' }}
                onBlur={(e) => updateSlide(currentSlide, { content: e.target.innerHTML })}
                onFocus={(e) => {
                  if (e.target.textContent === 'Click to add content') {
                    e.target.innerHTML = '';
                  }
                }}
                dangerouslySetInnerHTML={{ __html: slide.content || 'Click to add content' }}
              />
            )}

            {layoutType === 'two-column' && (
              <>
                <div
                  ref={titleRef}
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="absolute top-4 left-4 right-4 h-16 text-3xl font-bold text-center outline-none cursor-text border-2 border-dashed border-gray-300"
                  style={{ color: slide.textColor || '#1f2937' }}
                  onBlur={(e) => updateSlide(currentSlide, { title: e.target.innerHTML })}
                  onFocus={(e) => {
                    if (e.target.textContent === 'Click to add title') {
                      e.target.innerHTML = '';
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.title || 'Click to add title' }}
                />
                <div
                  ref={leftContentRef}
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="absolute top-24 left-4 right-1/2 bottom-4 mr-2 text-base outline-none cursor-text border-2 border-dashed border-gray-300 p-4"
                  style={{ color: slide.textColor || '#374151' }}
                  onBlur={(e) => updateSlide(currentSlide, { leftContent: e.target.innerHTML })}
                  onFocus={(e) => {
                    if (e.target.textContent === 'Click to add content') {
                      e.target.innerHTML = '';
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.leftContent || 'Click to add content' }}
                />
                <div
                  ref={rightContentRef}
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="absolute top-24 left-1/2 right-4 bottom-4 ml-2 text-base outline-none cursor-text border-2 border-dashed border-gray-300 p-4"
                  style={{ color: slide.textColor || '#374151' }}
                  onBlur={(e) => updateSlide(currentSlide, { rightContent: e.target.innerHTML })}
                  onFocus={(e) => {
                    if (e.target.textContent === 'Click to add content') {
                      e.target.innerHTML = '';
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.rightContent || 'Click to add content' }}
                />
              </>
            )}

            {layoutType === 'comparison' && (
              <>
                <div
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="absolute top-4 left-4 right-4 h-16 text-3xl font-bold text-center outline-none cursor-text border-2 border-dashed border-gray-300 flex items-center justify-center"
                  style={{ color: slide.textColor || '#1f2937' }}
                  onBlur={(e) => updateSlide(currentSlide, { title: e.target.innerHTML })}
                  onFocus={(e) => {
                    if (e.target.textContent === 'Click to add title') {
                      e.target.innerHTML = '';
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.title || 'Click to add title' }}
                />
                <div
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="absolute top-24 left-4 right-1/2 bottom-4 mr-2 text-base outline-none cursor-text border-2 border-dashed border-gray-300 p-4"
                  style={{ color: slide.textColor || '#374151' }}
                  onBlur={(e) => updateSlide(currentSlide, { leftContent: e.target.innerHTML })}
                  onFocus={(e) => {
                    if (e.target.textContent === 'Click to add content') {
                      e.target.innerHTML = '';
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.leftContent || 'Click to add content' }}
                />
                <div
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="absolute top-24 left-1/2 right-4 bottom-4 ml-2 text-base outline-none cursor-text border-2 border-dashed border-gray-300 p-4"
                  style={{ color: slide.textColor || '#374151' }}
                  onBlur={(e) => updateSlide(currentSlide, { rightContent: e.target.innerHTML })}
                  onFocus={(e) => {
                    if (e.target.textContent === 'Click to add content') {
                      e.target.innerHTML = '';
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.rightContent || 'Click to add content' }}
                />
              </>
            )}

            {layoutType === 'image-text' && (
              <>
                <div
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="absolute top-4 left-4 right-4 h-16 text-3xl font-bold text-center outline-none cursor-text border-2 border-dashed border-gray-300 flex items-center justify-center"
                  style={{ color: slide.textColor || '#1f2937' }}
                  onBlur={(e) => updateSlide(currentSlide, { title: e.target.innerHTML })}
                  onFocus={(e) => {
                    if (e.target.textContent === 'Click to add title') {
                      e.target.innerHTML = '';
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.title || 'Click to add title' }}
                />
                <div 
                  className="absolute top-24 left-4 right-1/2 bottom-4 mr-2 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const elements = slide.elements || [];
                          const newImage = {
                            id: Date.now(),
                            type: 'image',
                            src: event.target.result,
                            x: 20,
                            y: 120,
                            width: 440,
                            height: 380
                          };
                          updateSlide(currentSlide, { elements: [...elements, newImage] });
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <div className="text-sm">Click to add image</div>
                  </div>
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="absolute top-24 left-1/2 right-4 bottom-4 ml-2 text-base outline-none cursor-text border-2 border-dashed border-gray-300 p-4"
                  style={{ color: slide.textColor || '#374151' }}
                  onBlur={(e) => updateSlide(currentSlide, { rightContent: e.target.innerHTML })}
                  onFocus={(e) => {
                    if (e.target.textContent === 'Click to add content') {
                      e.target.innerHTML = '';
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.rightContent || 'Click to add content' }}
                />
              </>
            )}

            {/* Dynamic Elements */}
            {(slide.elements || []).map((element) => {
              if (element.type === 'image') {
                return (
                  <ImageEditor
                    key={element.id}
                    element={element}
                    onUpdate={(updates) => updateElement(element.id, updates)}
                    onDelete={() => deleteElement(element.id)}
                    isSelected={selectedElement === element.id}
                    onSelect={() => setSelectedElement(element.id)}
                  />
                );
              }

              const animStyle = getAnimationStyle(element.id);
              return (
                <div
                  key={animationPreview.active ? `animated-${element.id}` : element.id}
                  data-element-id={element.id}
                  className={`slide-element relative group ${selectedElement === element.id ? 'selected' : ''} ${animStyle.className} ${(element.type === 'shape' || element.type === 'icon') ? 'cursor-move' : ''}`}
                  style={{
                    position: 'absolute',
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    fontSize: element.fontSize,
                    fontFamily: element.fontFamily,
                    color: element.color,
                    backgroundColor: element.backgroundColor,
                    ...animStyle.style
                  }}
                  onClick={() => setSelectedElement(element.id)}
                  onMouseDown={(e) => {
                    if (element.type === 'shape' || element.type === 'icon') {
                      e.preventDefault();
                      e.stopPropagation();
                      const canvas = document.querySelector('.slide-canvas');
                      if (!canvas) return;
                      const rect = canvas.getBoundingClientRect();
                      const mouseX = e.clientX - rect.left;
                      const mouseY = e.clientY - rect.top;
                      setSelectedElement(element.id);
                      setDragOffset({ x: mouseX - element.x, y: mouseY - element.y });
                      setIsDragging(true);
                    }
                  }}
                >
                  {selectedElement === element.id && (element.type === 'shape' || element.type === 'icon') && (
                    <>
                      <div
                        className="absolute w-6 h-6 bg-blue-500 rounded-full cursor-move opacity-0 group-hover:opacity-75 hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                        style={{ left: -8, top: -8, zIndex: 100 }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const canvas = document.querySelector('.slide-canvas');
                          if (!canvas) return;
                          const rect = canvas.getBoundingClientRect();
                          const mouseX = e.clientX - rect.left;
                          const mouseY = e.clientY - rect.top;
                          setSelectedElement(element.id);
                          setDragOffset({ x: mouseX - element.x, y: mouseY - element.y });
                          setIsDragging(true);
                        }}
                        title="Drag to move"
                      >
                        ⊕
                      </div>

                      {/* Resize handles for shapes and icons */}
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: -6, top: -6, zIndex: 100 }} onMouseDown={(e) => startResize(e, element, 'nw')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: '50%', top: -6, transform: 'translateX(-50%)', zIndex: 100 }} onMouseDown={(e) => startResize(e, element, 'n')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity" style={{ right: -6, top: -6, zIndex: 100 }} onMouseDown={(e) => startResize(e, element, 'ne')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: -6, top: '50%', transform: 'translateY(-50%)', zIndex: 100 }} onMouseDown={(e) => startResize(e, element, 'w')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity" style={{ right: -6, top: '50%', transform: 'translateY(-50%)', zIndex: 100 }} onMouseDown={(e) => startResize(e, element, 'e')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: -6, bottom: -6, zIndex: 100 }} onMouseDown={(e) => startResize(e, element, 'sw')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', zIndex: 100 }} onMouseDown={(e) => startResize(e, element, 's')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity" style={{ right: -6, bottom: -6, zIndex: 100 }} onMouseDown={(e) => startResize(e, element, 'se')} title="Resize" />
                    </>
                  )}

                  {element.type === 'textbox' && (
                    <div
                      contentEditable
                      spellCheck={true}
                      suppressContentEditableWarning={true}
                      className="w-full h-full outline-none p-1 cursor-text"
                      dangerouslySetInnerHTML={{ __html: element.content }}
                      onBlur={(e) => updateElement(element.id, { content: e.target.innerHTML })}
                      onKeyDown={(e) => {
                        // Handle Enter key for list continuation only
                        if (e.key === 'Enter' && !e.ctrlKey) {
                          const selection = window.getSelection();
                          if (selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            const text = e.target.textContent;
                            const cursorPos = range.startOffset;
                            const beforeCursor = text.substring(0, cursorPos);
                            const lastLine = beforeCursor.split('\n').pop();
                            
                            const bulletMatch = lastLine.match(/^(\u2022|\d+\.|[A-Z]\.|\u2605|\u2192)\s/);
                            if (bulletMatch) {
                              e.preventDefault();
                              const prefix = bulletMatch[1];
                              let nextPrefix = prefix;
                              
                              if (/\d+\./.test(prefix)) {
                                const num = parseInt(prefix) + 1;
                                nextPrefix = `${num}.`;
                              } else if (/[A-Z]\./.test(prefix)) {
                                const char = String.fromCharCode(prefix.charCodeAt(0) + 1);
                                nextPrefix = `${char}.`;
                              }
                              
                              const newText = `\n${nextPrefix} `;
                              range.deleteContents();
                              range.insertNode(document.createTextNode(newText));
                              range.collapse(false);
                              selection.removeAllRanges();
                              selection.addRange(range);
                            }
                          }
                        }
                      }}
                    />
                  )}

                  {element.type === 'shape' && (
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
                      {element.shapeType === 'rectangle' && (
                        <rect
                          x="0" y="0" width="100" height="100"
                          fill={element.fill || '#F0A500'}
                          stroke={element.stroke || '#8a6d00'}
                          strokeWidth={element.strokeWidth || 2}
                          rx="2"
                        />
                      )}
                      {element.shapeType === 'circle' && (
                        <ellipse
                          cx="50" cy="50" rx="50" ry="50"
                          fill={element.fill || '#F0A500'}
                          stroke={element.stroke || '#8a6d00'}
                          strokeWidth={element.strokeWidth || 2}
                        />
                      )}
                      {element.shapeType === 'triangle' && (
                        <polygon
                          points="50,10 90,90 10,90"
                          fill={element.fill || '#F0A500'}
                          stroke={element.stroke || '#8a6d00'}
                          strokeWidth={element.strokeWidth || 2}
                        />
                      )}
                      {element.shapeType === 'arrow' && (
                        <polygon
                          points="10,40 60,40 60,20 90,50 60,80 60,60 10,60"
                          fill={element.fill || '#F0A500'}
                          stroke={element.stroke || '#8a6d00'}
                          strokeWidth={element.strokeWidth || 2}
                        />
                      )}
                      {element.shapeType === 'diamond' && (
                        <polygon
                          points="50,10 90,50 50,90 10,50"
                          fill={element.fill || '#F0A500'}
                          stroke={element.stroke || '#8a6d00'}
                          strokeWidth={element.strokeWidth || 2}
                        />
                      )}
                      {element.shapeType === 'star' && (
                        <polygon
                          points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
                          fill={element.fill || '#F0A500'}
                          stroke={element.stroke || '#8a6d00'}
                          strokeWidth={element.strokeWidth || 2}
                        />
                      )}
                      {element.shapeType === 'hexagon' && (
                        <polygon
                          points="25,10 75,10 90,50 75,90 25,90 10,50"
                          fill={element.fill || '#F0A500'}
                          stroke={element.stroke || '#8a6d00'}
                          strokeWidth={element.strokeWidth || 2}
                        />
                      )}
                      {element.shapeType === 'heart' && (
                        <path
                          d="M50,85 C20,60 5,35 5,20 C5,10 15,5 25,10 C35,5 45,10 50,20 C55,10 65,5 75,10 C85,5 95,10 95,20 C95,35 80,60 50,85 Z"
                          fill={element.fill || '#F0A500'}
                          stroke={element.stroke || '#8a6d00'}
                          strokeWidth={element.strokeWidth || 2}
                        />
                      )}
                      {element.shapeType === 'pentagon' && (
                        <polygon
                          points="50,10 90,35 75,85 25,85 10,35"
                          fill={element.fill || '#F0A500'}
                          stroke={element.stroke || '#8a6d00'}
                          strokeWidth={element.strokeWidth || 2}
                        />
                      )}
                      {element.shapeType === 'oval' && (
                        <ellipse
                          cx="50" cy="50" rx="45" ry="30"
                          fill={element.fill || '#F0A500'}
                          stroke={element.stroke || '#8a6d00'}
                          strokeWidth={element.strokeWidth || 2}
                        />
                      )}
                    </svg>
                  )}

                  {element.type === 'icon' && (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        fontSize: `${Math.min(element.width, element.height) * 0.6}px`,
                        color: element.color || '#F0A500',
                        pointerEvents: 'none'
                      }}
                    >
                      {element.content || '⭐'}
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

                  {element.type === 'chart' && (
                    <div className="w-full h-full border-2 border-gray-300 bg-white rounded overflow-hidden flex flex-col">
                      {element.title && (
                        <div className="text-center font-bold text-sm py-2 text-gray-800 border-b border-gray-200">
                          {element.title}
                        </div>
                      )}
                      <div className="flex-1 p-4 flex items-center justify-center min-h-0">
                        {(element.chartType === 'bar' || !element.chartType) && (
                          <div className="w-full h-full flex items-end justify-around">
                            {(element.data?.datasets?.[0]?.data || [30, 60, 45, 80]).map((value, i) => {
                              const maxValue = Math.max(...(element.data?.datasets?.[0]?.data || [30, 60, 45, 80]));
                              const barHeight = Math.max((value / maxValue) * 80, 8);
                              return (
                                <div key={i} className="flex flex-col items-center h-full justify-end">
                                  {element.options?.dataLabels && <div className="text-xs mb-1">{value}</div>}
                                  <div
                                    className="w-6 md:w-8 rounded-t transition-all"
                                    style={{ 
                                      height: `${barHeight}%`,
                                      backgroundColor: element.data?.datasets?.[0]?.color || '#3B82F6'
                                    }}
                                  />
                                  <span className="text-xs mt-2">{element.data?.labels?.[i] || `Q${i+1}`}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {element.chartType === 'line' && (
                          <svg className="w-full h-full max-w-full max-h-full" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">
                            <defs>
                              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={element.data?.datasets?.[0]?.color || '#3B82F6'} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={element.data?.datasets?.[0]?.color || '#3B82F6'} stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <polyline
                              fill="none"
                              stroke={element.data?.datasets?.[0]?.color || '#3B82F6'}
                              strokeWidth="3"
                              points="20,80 60,40 100,60 140,20 180,50"
                            />
                            <circle cx="20" cy="80" r="4" fill={element.data?.datasets?.[0]?.color || '#3B82F6'} />
                            <circle cx="60" cy="40" r="4" fill={element.data?.datasets?.[0]?.color || '#3B82F6'} />
                            <circle cx="100" cy="60" r="4" fill={element.data?.datasets?.[0]?.color || '#3B82F6'} />
                            <circle cx="140" cy="20" r="4" fill={element.data?.datasets?.[0]?.color || '#3B82F6'} />
                            <circle cx="180" cy="50" r="4" fill={element.data?.datasets?.[0]?.color || '#3B82F6'} />
                          </svg>
                        )}
                        {element.chartType === 'pie' && (
                          <svg className="w-full h-full max-w-full max-h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                            <circle cx="50" cy="50" r="35" fill="#3B82F6" />
                            <path d="M 50 50 L 50 15 A 35 35 0 0 1 78.5 32 Z" fill="#10B981" />
                            <path d="M 50 50 L 78.5 32 A 35 35 0 0 1 78.5 68 Z" fill="#F59E0B" />
                            <path d="M 50 50 L 78.5 68 A 35 35 0 0 1 50 85 Z" fill="#EF4444" />
                          </svg>
                        )}
                        {element.chartType === 'doughnut' && (
                          <svg className="w-full h-full max-w-full max-h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray="55 165" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="44 176" strokeDashoffset="-55" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="33 187" strokeDashoffset="-99" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray="88 132" strokeDashoffset="-132" />
                          </svg>
                        )}
                      </div>
                      {element.options?.legend && element.data?.datasets && (
                        <div className="flex justify-center p-2 border-t border-gray-200 text-xs bg-gray-50">
                          {element.data.datasets.map((dataset, i) => (
                            <div key={i} className="flex items-center mx-2">
                              <div className="w-3 h-3 mr-1 rounded" style={{ backgroundColor: dataset.color || '#3B82F6' }} />
                              <span>{dataset.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {element.type === 'chart' && selectedElement === element.id && (
                    <>
                      <div 
                        className="absolute w-6 h-6 bg-blue-500 rounded-full cursor-move opacity-75 hover:opacity-100 flex items-center justify-center text-white text-xs font-bold"
                        style={{ left: -8, top: -8, zIndex: 100 }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const canvas = document.querySelector('.slide-canvas');
                          if (!canvas) return;
                          const rect = canvas.getBoundingClientRect();
                          const mouseX = e.clientX - rect.left;
                          const mouseY = e.clientY - rect.top;
                          setSelectedElement(element.id);
                          setDragOffset({ x: mouseX - element.x, y: mouseY - element.y });
                          setIsDragging(true);
                        }}
                        title="Drag to move chart"
                      >
                        ⊕
                      </div>

                      {/* Resize handles for chart */}
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize z-50" style={{ left: -6, top: -6 }} onMouseDown={(e) => startResize(e, element, 'nw')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize z-50" style={{ left: '50%', top: -6, transform: 'translateX(-50%)' }} onMouseDown={(e) => startResize(e, element, 'n')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize z-50" style={{ right: -6, top: -6 }} onMouseDown={(e) => startResize(e, element, 'ne')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize z-50" style={{ left: -6, top: '50%', transform: 'translateY(-50%)' }} onMouseDown={(e) => startResize(e, element, 'w')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize z-50" style={{ right: -6, top: '50%', transform: 'translateY(-50%)' }} onMouseDown={(e) => startResize(e, element, 'e')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize z-50" style={{ left: -6, bottom: -6 }} onMouseDown={(e) => startResize(e, element, 'sw')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize z-50" style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)' }} onMouseDown={(e) => startResize(e, element, 's')} title="Resize" />
                      <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize z-50" style={{ right: -6, bottom: -6 }} onMouseDown={(e) => startResize(e, element, 'se')} title="Resize" />
                    </>
                  )}

                  {element.type === 'table' && (
                    <div className="w-full h-full border-2 border-gray-400 bg-white rounded overflow-hidden relative group pointer-events-none">
                      {selectedElement === element.id && (
                        <>
                          <div className="absolute -top-8 left-0 flex gap-1 z-10 pointer-events-auto">
                            {[
                              { name: 'Blue', header: '#3B82F6', alt: '#EBF4FF', border: '#2563EB' },
                              { name: 'Green', header: '#10B981', alt: '#ECFDF5', border: '#059669' },
                              { name: 'Orange', header: '#F59E0B', alt: '#FFFBEB', border: '#D97706' },
                              { name: 'Purple', header: '#8B5CF6', alt: '#F3E8FF', border: '#7C3AED' },
                              { name: 'Red', header: '#EF4444', alt: '#FEF2F2', border: '#DC2626' },
                              { name: 'Gray', header: '#6B7280', alt: '#F9FAFB', border: '#4B5563' }
                            ].map((theme) => (
                              <button
                                key={theme.name}
                                onClick={() => updateElement(element.id, { theme })}
                                className="w-6 h-6 rounded border-2 border-white shadow-sm hover:scale-110 transition-transform"
                                style={{ backgroundColor: theme.header }}
                                title={`${theme.name} theme`}
                              />
                            ))}
                          </div>
                          <div 
                            className="absolute w-6 h-6 bg-blue-500 rounded-full cursor-move opacity-75 hover:opacity-100 flex items-center justify-center text-white text-xs font-bold pointer-events-auto"
                            style={{ left: -8, top: -8, zIndex: 100 }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const canvas = document.querySelector('.slide-canvas');
                              if (!canvas) return;
                              const rect = canvas.getBoundingClientRect();
                              const mouseX = e.clientX - rect.left;
                              const mouseY = e.clientY - rect.top;
                              setSelectedElement(element.id);
                              setDragOffset({ x: mouseX - element.x, y: mouseY - element.y });
                              setIsDragging(true);
                            }}
                            title="Drag to move table"
                          >
                            ⊕
                          </div>
                          {/* Resize handles for table */}
                          <div className="absolute w-5 h-5 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize pointer-events-auto hover:scale-150 hover:brightness-110 active:scale-150 active:brightness-125 transition-all duration-100 ease-out" style={{ left: -10, top: -10, boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)' }} onMouseDown={(e) => startResize(e, element, 'nw')} title="Resize" />
                          <div className="absolute w-5 h-5 bg-blue-500 border-2 border-white rounded-full cursor-n-resize pointer-events-auto hover:scale-150 hover:brightness-110 active:scale-150 active:brightness-125 transition-all duration-100 ease-out" style={{ left: '50%', top: -10, transform: 'translateX(-50%)', boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)' }} onMouseDown={(e) => startResize(e, element, 'n')} title="Resize" />
                          <div className="absolute w-5 h-5 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize pointer-events-auto hover:scale-150 hover:brightness-110 active:scale-150 active:brightness-125 transition-all duration-100 ease-out" style={{ right: -10, top: -10, boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)' }} onMouseDown={(e) => startResize(e, element, 'ne')} title="Resize" />
                          <div className="absolute w-5 h-5 bg-blue-500 border-2 border-white rounded-full cursor-w-resize pointer-events-auto hover:scale-150 hover:brightness-110 active:scale-150 active:brightness-125 transition-all duration-100 ease-out" style={{ left: -10, top: '50%', transform: 'translateY(-50%)', boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)' }} onMouseDown={(e) => startResize(e, element, 'w')} title="Resize" />
                          <div className="absolute w-5 h-5 bg-blue-500 border-2 border-white rounded-full cursor-e-resize pointer-events-auto hover:scale-150 hover:brightness-110 active:scale-150 active:brightness-125 transition-all duration-100 ease-out" style={{ right: -10, top: '50%', transform: 'translateY(-50%)', boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)' }} onMouseDown={(e) => startResize(e, element, 'e')} title="Resize" />
                          <div className="absolute w-5 h-5 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize pointer-events-auto hover:scale-150 hover:brightness-110 active:scale-150 active:brightness-125 transition-all duration-100 ease-out" style={{ left: -10, bottom: -10, boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)' }} onMouseDown={(e) => startResize(e, element, 'sw')} title="Resize" />
                          <div className="absolute w-5 h-5 bg-blue-500 border-2 border-white rounded-full cursor-s-resize pointer-events-auto hover:scale-150 hover:brightness-110 active:scale-150 active:brightness-125 transition-all duration-100 ease-out" style={{ left: '50%', bottom: -10, transform: 'translateX(-50%)', boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)' }} onMouseDown={(e) => startResize(e, element, 's')} title="Resize" />
                          <div className="absolute w-5 h-5 bg-blue-500 border-2 border-white rounded-full cursor-se-resize pointer-events-auto hover:scale-150 hover:brightness-110 active:scale-150 active:brightness-125 transition-all duration-100 ease-out" style={{ right: -10, bottom: -10, boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)' }} onMouseDown={(e) => startResize(e, element, 'se')} title="Resize" />
                        </>
                      )}
                      <table className="w-full h-full border-collapse table-fixed pointer-events-auto">
                        <tbody>
                          {element.data?.map((row, rowIndex) => {
                            const theme = element.theme || { header: '#6B7280', alt: '#F9FAFB', border: '#4B5563' };
                            const isHeader = rowIndex === 0;
                            const isAltRow = rowIndex % 2 === 1;
                            return (
                              <tr key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                  <td
                                    key={colIndex}
                                    className="border p-2 text-sm align-top"
                                    style={{
                                      width: `${100 / row.length}%`,
                                      minHeight: '30px',
                                      fontWeight: isHeader ? 'bold' : 'normal',
                                      backgroundColor: isHeader ? theme.header : (isAltRow ? theme.alt : '#ffffff'),
                                      color: isHeader ? '#ffffff' : '#000000',
                                      borderColor: theme.border
                                    }}
                                    contentEditable
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                      const newData = [...element.data];
                                      newData[rowIndex][colIndex] = e.target.textContent;
                                      updateElement(element.id, { data: newData });
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Tab') {
                                        e.preventDefault();
                                        const nextCell = e.target.parentElement.nextElementSibling?.children[colIndex] ||
                                                        e.target.parentElement.parentElement.children[rowIndex + 1]?.children[0];
                                        if (nextCell) {
                                          nextCell.focus();
                                        }
                                      }
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const nextRow = e.target.parentElement.parentElement.children[rowIndex + 1];
                                        if (nextRow) {
                                          nextRow.children[colIndex].focus();
                                        }
                                      }
                                    }}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {selectedElement === element.id && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElement(element.id);
                        }}
                        className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 hover:bg-red-600 text-white text-lg font-medium transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10"
                        title="Delete element"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
      </div>

      {/* Modals */}
      {showChartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ChartComponent onClose={() => setShowChartModal(false)} />
        </div>
      )}
    </div>
  );
};

export default SlideEditor;