import React from 'react';

const LayoutSelector = ({ applyLayout, currentSlide, onClose }) => {

  const layouts = [
    { id: 'blank', name: 'Blank', icon: '⬜' },
    { id: 'title-content', name: 'Title & Content', icon: '📄' },
    { id: 'title-only', name: 'Title Only', icon: '📝' },
    { id: 'content-only', name: 'Content Only', icon: '📋' },
    { id: 'two-column', name: 'Two Column', icon: '📊' },
    { id: 'image-text', name: 'Image & Text', icon: '🖼️' },
    { id: 'comparison', name: 'Comparison', icon: '⚖️' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Layout</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {layouts.map((layout) => (
              <button
                key={layout.id}
                onClick={(e) => {
                  e.stopPropagation();
                  applyLayout(layout.id);
                  setTimeout(() => onClose(), 100);
                }}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex flex-col items-center"
              >
                <div className="text-2xl mb-2">{layout.icon}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 text-center">{layout.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutSelector;