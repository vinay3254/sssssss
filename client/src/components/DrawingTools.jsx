import React from 'react';

const DrawingTools = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Drawing</h3>
      <div className="space-y-2">
        {['Pen', 'Highlighter', 'Eraser'].map(tool => (
          <button key={tool} className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            {tool}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DrawingTools;