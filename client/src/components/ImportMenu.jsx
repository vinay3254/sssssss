import React, { useRef } from 'react';
import { RiUploadLine, RiGoogleLine, RiMicrosoftLine, RiDropboxLine } from 'react-icons/ri';

const ImportMenu = ({ isOpen, onClose, onImport }) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDeviceImport = () => {
    fileInputRef.current?.click();
    onClose();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const fileType = file.name.split('.').pop().toLowerCase();
      onImport(file, fileType);
    });
  };

  const handleCloudImport = (service) => {
    alert(`${service} integration coming soon!`);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
        <div className="py-1">
          <button
            onClick={handleDeviceImport}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          >
            <RiUploadLine className="w-4 h-4" />
            From Device
          </button>
          
          <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
          
          <button
            onClick={() => handleCloudImport('Google Drive')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          >
            <RiGoogleLine className="w-4 h-4" />
            Google Drive
          </button>
          
          <button
            onClick={() => handleCloudImport('OneDrive')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          >
            <RiMicrosoftLine className="w-4 h-4" />
            OneDrive
          </button>
          
          <button
            onClick={() => handleCloudImport('Dropbox')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          >
            <RiDropboxLine className="w-4 h-4" />
            Dropbox
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pptx,.ppt,.pdf,.jpg,.jpeg,.png,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </>
  );
};

export default ImportMenu;