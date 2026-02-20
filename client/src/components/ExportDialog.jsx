import React, { useState } from 'react';
import { RiCloseLine, RiDownloadLine, RiFilePptLine, RiFileTextLine, RiImageLine, RiVideoLine } from 'react-icons/ri';

const ExportDialog = ({ isOpen, onClose, onExport, presentationName = 'Presentation' }) => {
  const [selectedFormat, setSelectedFormat] = useState('pptx');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const exportFormats = {
    presentation: [
      { id: 'pptx', name: 'PowerPoint Presentation (.pptx)', icon: RiFilePptLine, desc: 'Editable format' },
      { id: 'pdf', name: 'PDF Document (.pdf)', icon: RiFileTextLine, desc: 'Fixed layout' },
      { id: 'odp', name: 'OpenDocument Presentation (.odp)', icon: RiFilePptLine, desc: 'LibreOffice compatible' }
    ],
    document: [
      { id: 'docx', name: 'Word Document (.docx)', icon: RiFileTextLine, desc: 'With slides and notes' },
      { id: 'rtf', name: 'Rich Text Format (.rtf)', icon: RiFileTextLine, desc: 'Universal text format' }
    ],
    media: [
      { id: 'mp4', name: 'Video File (.mp4)', icon: RiVideoLine, desc: 'Presentation with timings' },
      { id: 'png', name: 'PNG Images (.png)', icon: RiImageLine, desc: 'All slides as images' },
      { id: 'jpeg', name: 'JPEG Images (.jpeg)', icon: RiImageLine, desc: 'All slides as images' }
    ]
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(selectedFormat);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderFormatGroup = (title, formats) => (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{title}</h4>
      <div className="space-y-2">
        {formats.map((format) => {
          const IconComponent = format.icon;
          return (
            <label
              key={format.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedFormat === format.id
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <input
                type="radio"
                name="format"
                value={format.id}
                checked={selectedFormat === format.id}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="sr-only"
              />
              <IconComponent className="w-5 h-5 text-gray-500 mr-3" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {format.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {format.desc}
                </div>
              </div>
              {selectedFormat === format.id && (
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export Presentation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Exporting: <span className="font-medium">{presentationName}</span>
            </p>
          </div>

          {renderFormatGroup('Export as Presentation', exportFormats.presentation)}
          {renderFormatGroup('Export as Handouts/Document', exportFormats.document)}
          {renderFormatGroup('Export as Images/Video', exportFormats.media)}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="btn-secondary px-4 py-2 text-sm"
              disabled={isExporting}
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn-primary px-4 py-2 text-sm inline-flex items-center"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <RiDownloadLine className="mr-2" />
                  Export
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;