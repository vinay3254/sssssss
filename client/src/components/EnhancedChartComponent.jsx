import React from 'react';

const EnhancedChartComponent = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Charts</h3>
      <div className="space-y-2">
        {['Bar Chart', 'Line Chart', 'Pie Chart'].map(chart => (
          <button key={chart} className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            {chart}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnhancedChartComponent;