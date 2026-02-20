import React, { useState } from 'react';
import { RiCloseLine, RiUploadLine, RiFileTextLine, RiImageLine, RiFilePptLine } from 'react-icons/ri';

const ImportDialog = ({ isOpen, onClose, onImport }) => {
  const [activeTab, setActiveTab] = useState('device');

  if (!isOpen) return null;

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const fileType = file.name.split('.').pop().toLowerCase();
      onImport(file, fileType);
    });
    onClose();
  };

  const handleCloudImport = (service) => {
    // Placeholder for cloud service integration
    alert(`${service} integration coming soon!`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Import</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Tabs */}
          <div className="flex mb-4 border-b border-gray-200 dark:border-gray-600">
            <button
              onClick={() => setActiveTab('device')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'device' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-gray-500'}`}
            >
              From Device
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'cloud' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-gray-500'}`}
            >
              From Cloud
            </button>
          </div>

          {/* Device Import */}
          {activeTab === 'device' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <RiUploadLine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select files to import
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pptx,.ppt,.pdf,.jpg,.jpeg,.png,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="btn-primary cursor-pointer inline-flex items-center px-4 py-2 text-sm"
                >
                  <RiUploadLine className="mr-2" />
                  Choose Files
                </label>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Supported Formats:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <RiFilePptLine className="mr-1" />
                    .pptx, .ppt
                  </div>
                  <div className="flex items-center">
                    <RiFileTextLine className="mr-1" />
                    .pdf, .txt
                  </div>
                  <div className="flex items-center">
                    <RiImageLine className="mr-1" />
                    .jpg, .png
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cloud Import */}
          {activeTab === 'cloud' && (
            <div className="space-y-3">
              <button
                onClick={() => handleCloudImport('Google Drive')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-6 h-6 bg-blue-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google Drive</span>
              </button>
              
              <button
                onClick={() => handleCloudImport('OneDrive')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-6 h-6 bg-blue-600 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">OneDrive</span>
              </button>
              
              <button
                onClick={() => handleCloudImport('Dropbox')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-6 h-6 bg-blue-700 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dropbox</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportDialog;