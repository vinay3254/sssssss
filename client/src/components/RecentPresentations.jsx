import React, { useState, useEffect } from 'react';
import { usePresentation } from '../contexts/PresentationContext';
import { loadFromLocal, listLocalPresentations } from '../utils/cloudStorage';

const RecentPresentations = ({ onClose, onLoadPresentation }) => {
  const { setSlides } = usePresentation();
  const [recentPresentations, setRecentPresentations] = useState([]);

  useEffect(() => {
    loadRecentPresentations();
  }, []);

  const loadRecentPresentations = () => {
    const presentations = listLocalPresentations()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10); // Show last 10 presentations
    setRecentPresentations(presentations);
  };

  const handleLoadPresentation = (filename) => {
    try {
      const data = loadFromLocal(filename);
      if (data && data.slides) {
        setSlides(data.slides);
        onLoadPresentation?.(data);
        onClose();
      }
    } catch (error) {
      alert('Failed to load presentation: ' + error.message);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-3/4 max-w-4xl h-3/4">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Presentations
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full">
          {recentPresentations.length > 0 ? (
            <div className="space-y-3">
              {recentPresentations.map((presentation, index) => (
                <div
                  key={presentation.filename}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => handleLoadPresentation(presentation.filename)}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {presentation.filename}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Modified {formatDate(presentation.timestamp)}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadPresentation(presentation.filename);
                      }}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📁</div>
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                No recent presentations found
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Start creating presentations to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentPresentations;