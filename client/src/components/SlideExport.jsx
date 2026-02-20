import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';
import { exportSlideAsImage } from '../utils/exportUtils';

const SlideExport = ({ slideIndex, onClose }) => {
  const { slides } = usePresentation();
  const [format, setFormat] = useState('png');
  const [isExporting, setIsExporting] = useState(false);
  
  const slide = slides[slideIndex];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const slideElement = document.querySelector('.slide-canvas');
      if (slideElement) {
        await exportSlideAsImage(slideElement, format, `slide-${slideIndex + 1}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Export Slide {slideIndex + 1}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="png">PNG (Recommended)</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Slide Preview:</strong> {slide?.title || 'Untitled Slide'}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideExport;