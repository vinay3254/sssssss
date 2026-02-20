import React from 'react';
import { RiCloseLine } from 'react-icons/ri';

const ThesaurusModal = ({ isOpen, onClose, word, synonyms, onSelectSynonym }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Synonyms for "{word}"
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className="p-4 max-h-80 overflow-y-auto">
          {synonyms && synonyms.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Click on a synonym to replace the selected word:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {synonyms.map((synonym, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectSynonym(synonym)}
                    className="p-2 text-left border border-gray-200 dark:border-gray-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-sm"
                  >
                    {synonym}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No synonyms found for "{word}"
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Try selecting a different word
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThesaurusModal;