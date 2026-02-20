import React, { useRef } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const ImageUpload = () => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const fileInputRef = useRef(null);
  
  const slide = slides[currentSlide] || {};

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newElement = {
          id: Date.now(),
          type: 'image',
          src: e.target.result,
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          alt: file.name
        };
        
        const elements = slide.elements || [];
        updateSlide(currentSlide, { elements: [...elements, newElement] });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <button
        onClick={triggerFileInput}
        className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        📷 Upload Image
      </button>
    </div>
  );
};

export default ImageUpload;