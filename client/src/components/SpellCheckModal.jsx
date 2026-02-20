import React from 'react';
import { RiCloseLine, RiCheckLine } from 'react-icons/ri';

const SpellCheckModal = ({ isOpen, onClose, misspelledWords, onReplaceWord, onIgnoreWord }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Spelling Check Results
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className="p-4 max-h-80 overflow-y-auto">
          {misspelledWords && misspelledWords.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found {misspelledWords.length} potentially misspelled word{misspelledWords.length !== 1 ? 's' : ''}:
              </p>
              <div className="space-y-2">
                {misspelledWords.map((item, index) => (
                  <div key={index} className="border border-red-200 dark:border-red-700 rounded p-3 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-700 dark:text-red-300">
                        "{item.word}"
                      </span>
                      <span className="text-xs text-gray-500">at position {item.position}</span>
                    </div>
                    {item.suggestions && item.suggestions.length > 0 ? (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Suggestions:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.suggestions.slice(0, 5).map((suggestion, sIndex) => (
                            <button
                              key={sIndex}
                              onClick={() => onReplaceWord(item.word, suggestion, item.position)}
                              className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No suggestions available</p>
                    )}
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => onIgnoreWord(item.word)}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <RiCheckLine className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No spelling errors found!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                All words appear to be spelled correctly.
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

export default SpellCheckModal;