import React from 'react';

const InteractiveElements = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Interactive Elements</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">✕</button>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Interactive presentation elements coming soon!
        </p>
        <button onClick={onClose} className="btn-primary w-full">
          Close
        </button>
      </div>
    </div>
  );
};

export default InteractiveElements;