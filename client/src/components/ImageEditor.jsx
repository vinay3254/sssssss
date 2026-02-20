import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RiCropLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';

const ImageEditor = ({ element, onUpdate, onDelete, isSelected, onSelect }) => {
  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: element.width || 200,
    height: element.height || 150
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Initialize crop area when entering crop mode
  useEffect(() => {
    if (isCropping && element.src) {
      const img = new Image();
      img.onload = () => {
        // Calculate the actual displayed image dimensions and position
        const scale = Math.max(element.width / img.width, element.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (element.width - scaledWidth) / 2;
        const offsetY = (element.height - scaledHeight) / 2;

        // Set crop area to cover most of the visible image area
        const margin = 20;
        setCropArea({
          x: Math.max(0, offsetX + margin),
          y: Math.max(0, offsetY + margin),
          width: Math.min(element.width - 2 * margin, scaledWidth - 2 * margin),
          height: Math.min(element.height - 2 * margin, scaledHeight - 2 * margin)
        });
      };
      img.src = element.src;
    }
  }, [isCropping, element.src, element.width, element.height]);

  // Global mouse event handlers for dragging and resizing
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isCropping) {
        // Handle crop area dragging
        if (isDragging) {
          const canvas = document.querySelector('.slide-canvas');
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left - dragOffset.x;
          const y = e.clientY - rect.top - dragOffset.y;

          setCropArea(prev => ({
            ...prev,
            x: Math.max(0, Math.min(x, element.width - prev.width)),
            y: Math.max(0, Math.min(y, element.height - prev.height))
          }));
        }
        // Handle crop area resizing
        else if (isResizing && resizeHandle) {
          const canvas = document.querySelector('.slide-canvas');
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          setCropArea(prev => {
            let newArea = { ...prev };

            switch (resizeHandle) {
              case 'nw':
                newArea.x = Math.min(mouseX, prev.x + prev.width - 20);
                newArea.y = Math.min(mouseY, prev.y + prev.height - 20);
                newArea.width = prev.x + prev.width - newArea.x;
                newArea.height = prev.y + prev.height - newArea.y;
                break;
              case 'ne':
                newArea.y = Math.min(mouseY, prev.y + prev.height - 20);
                newArea.width = Math.max(20, mouseX - prev.x);
                newArea.height = prev.y + prev.height - newArea.y;
                break;
              case 'sw':
                newArea.x = Math.min(mouseX, prev.x + prev.width - 20);
                newArea.width = prev.x + prev.width - newArea.x;
                newArea.height = Math.max(20, mouseY - prev.y);
                break;
              case 'se':
                newArea.width = Math.max(20, mouseX - prev.x);
                newArea.height = Math.max(20, mouseY - prev.y);
                break;
            }

            return newArea;
          });
        }
      } else {
        // Handle element dragging
        if (isDragging) {
          const canvas = document.querySelector('.slide-canvas');
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left - dragOffset.x;
          const y = e.clientY - rect.top - dragOffset.y;

          onUpdate({
            x: Math.max(0, x),
            y: Math.max(0, y)
          });
        }
        // Handle element resizing
        else if (isResizing && resizeHandle) {
          const canvas = document.querySelector('.slide-canvas');
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          let newWidth = element.width;
          let newHeight = element.height;
          let newX = element.x;
          let newY = element.y;

          switch (resizeHandle) {
            case 'nw':
              newWidth = Math.max(20, element.x + element.width - mouseX);
              newHeight = Math.max(20, element.y + element.height - mouseY);
              newX = Math.max(0, mouseX);
              newY = Math.max(0, mouseY);
              break;
            case 'ne':
              newWidth = Math.max(20, mouseX - element.x);
              newHeight = Math.max(20, element.y + element.height - mouseY);
              newY = Math.max(0, mouseY);
              break;
            case 'sw':
              newWidth = Math.max(20, element.x + element.width - mouseX);
              newHeight = Math.max(20, mouseY - element.y);
              newX = Math.max(0, mouseX);
              break;
            case 'se':
              newWidth = Math.max(20, mouseX - element.x);
              newHeight = Math.max(20, mouseY - element.y);
              break;
            case 'n':
              newHeight = Math.max(20, element.y + element.height - mouseY);
              newY = Math.max(0, mouseY);
              break;
            case 's':
              newHeight = Math.max(20, mouseY - element.y);
              break;
            case 'w':
              newWidth = Math.max(20, element.x + element.width - mouseX);
              newX = Math.max(0, mouseX);
              break;
            case 'e':
              newWidth = Math.max(20, mouseX - element.x);
              break;
          }

          onUpdate({
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight
          });
        }
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, resizeHandle, dragOffset, element, onUpdate, isCropping]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();

    if (isCropping) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  }, [isCropping, onSelect]);

  const handleResizeStart = useCallback((e, handle) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    setIsResizing(true);
    setResizeHandle(handle);
  }, [onSelect]);


  const applyCrop = useCallback(() => {
    if (!element.src || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate scale factor between display size and source image size
      const scaleX = img.width / element.width;
      const scaleY = img.height / element.height;
      const scale = Math.max(scaleX, scaleY); // object-cover scale

      // Calculate offset for object-cover centering
      const scaledWidth = img.width / scale;
      const scaledHeight = img.height / scale;
      const offsetX = (element.width - scaledWidth) / 2;
      const offsetY = (element.height - scaledHeight) / 2;

      // Convert crop coordinates from display space to source space
      const sourceX = (cropArea.x - offsetX) * scale;
      const sourceY = (cropArea.y - offsetY) * scale;
      const sourceWidth = cropArea.width * scale;
      const sourceHeight = cropArea.height * scale;

      // Ensure coordinates are within image bounds
      const clampedX = Math.max(0, Math.min(sourceX, img.width - sourceWidth));
      const clampedY = Math.max(0, Math.min(sourceY, img.height - sourceHeight));
      const clampedWidth = Math.min(sourceWidth, img.width - clampedX);
      const clampedHeight = Math.min(sourceHeight, img.height - clampedY);

      // Set canvas size to crop area
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      // Draw cropped portion
      ctx.drawImage(
        img,
        clampedX, clampedY, clampedWidth, clampedHeight, // Source rectangle
        0, 0, cropArea.width, cropArea.height // Destination rectangle
      );

      // Convert to data URL and update element
      const croppedDataUrl = canvas.toDataURL('image/png');
      onUpdate({
        src: croppedDataUrl,
        width: cropArea.width,
        height: cropArea.height
      });

      setIsCropping(false);
    };

    img.src = element.src;
  }, [element.src, element.width, element.height, cropArea, onUpdate]);

  const cancelCrop = useCallback(() => {
    setIsCropping(false);
  }, []);

  return (
    <div
      className={`slide-element ${isSelected ? 'selected' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        position: 'absolute',
        cursor: isCropping ? 'default' : 'move'
      }}
      onMouseDown={handleMouseDown}
      onMouseLeave={() => {
        if (!isDragging && !isResizing) return;
        setIsDragging(false);
        setIsResizing(false);
        setResizeHandle(null);
      }}
    >
      {/* Image */}
      <img
        ref={imageRef}
        src={element.src}
        alt={element.alt || 'Image'}
        className="w-full h-full object-cover"
        style={{
          opacity: element.opacity || 1,
          filter: `brightness(${element.brightness || 1}) contrast(${element.contrast || 1})`,
          borderRadius: `${element.borderRadius || 0}px`,
          pointerEvents: isCropping ? 'none' : 'auto'
        }}
        draggable={false}
      />

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Crop Overlay */}
      {isCropping && (
        <div className="absolute inset-0 bg-black bg-opacity-50">
          {/* Crop Area Indicator */}
          <div
            className="absolute border-2 border-white border-dashed bg-transparent"
            style={{
              left: cropArea.x,
              top: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
              cursor: 'move'
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
              });
              setIsDragging(true);
            }}
          >
            {/* Crop Resize Handles */}
            <div
              className="absolute w-3 h-3 bg-white border border-gray-400 cursor-nw-resize"
              style={{ left: -6, top: -6 }}
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className="absolute w-3 h-3 bg-white border border-gray-400 cursor-ne-resize"
              style={{ right: -6, top: -6 }}
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className="absolute w-3 h-3 bg-white border border-gray-400 cursor-sw-resize"
              style={{ left: -6, bottom: -6 }}
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className="absolute w-3 h-3 bg-white border border-gray-400 cursor-se-resize"
              style={{ right: -6, bottom: -6 }}
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
          </div>
        </div>
      )}

      {/* Selection and Resize Handles */}
      {isSelected && !isCropping && (
        <>
          {/* Selection Border */}
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />

          {/* Resize Handles */}
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-nw-resize"
            style={{ left: -6, top: -6 }}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-n-resize"
            style={{ left: '50%', top: -6, transform: 'translateX(-50%)' }}
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-ne-resize"
            style={{ right: -6, top: -6 }}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-w-resize"
            style={{ left: -6, top: '50%', transform: 'translateY(-50%)' }}
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-e-resize"
            style={{ right: -6, top: '50%', transform: 'translateY(-50%)' }}
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-sw-resize"
            style={{ left: -6, bottom: -6 }}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-s-resize"
            style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)' }}
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-se-resize"
            style={{ right: -6, bottom: -6 }}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />

          {/* Control Buttons */}
          <div className="absolute -top-12 left-0 flex gap-1">
            <button
              onClick={() => setIsCropping(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
              title="Crop Image"
            >
              <RiCropLine className="w-3 h-3" />
              Crop
            </button>
          </div>
        </>
      )}

      {/* Crop Control Buttons */}
      {isCropping && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={applyCrop}
            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded flex items-center"
            title="Apply Crop"
          >
            <RiCheckLine className="w-4 h-4" />
          </button>
          <button
            onClick={cancelCrop}
            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded flex items-center"
            title="Cancel Crop"
          >
            <RiCloseLine className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center"
        >
          <RiCloseLine className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ImageEditor;