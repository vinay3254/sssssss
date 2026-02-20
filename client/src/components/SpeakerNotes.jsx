import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const SpeakerNotes = () => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const slide = slides[currentSlide] || {};

  const handleNotesChange = (e) => {
    updateSlide(currentSlide, { notes: e.target.value });
  };

  if (!isExpanded) {
    return (
      <div className="bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 p-2">
        <button
          onClick={() => setIsExpanded(true)}
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          📝 Click to add speaker notes
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Speaker Notes</h4>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          ✕
        </button>
      </div>
      <textarea
        value={slide.notes || ''}
        onChange={handleNotesChange}
        placeholder="Add your speaker notes here..."
        className="w-full h-24 p-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />
    </div>
  );
};

export default SpeakerNotes;