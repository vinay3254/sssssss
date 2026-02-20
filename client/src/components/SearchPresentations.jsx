import React from 'react';

const SearchPresentations = ({ onClose, onLoadPresentation }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Search Presentations</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">✕</button>
        </div>
        <input
          type="text"
          placeholder="Search presentations..."
          className="form-input mb-4"
        />
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          No presentations found.
        </p>
        <button onClick={onClose} className="btn-primary w-full">
          Close
        </button>
      </div>
    </div>
  );
};

export default SearchPresentations;