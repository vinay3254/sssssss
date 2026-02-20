import React, { useState, useRef } from 'react';
import { usePresentation } from '../contexts/PresentationContext';
import { 
  exportToPPTX, 
  exportToPDF, 
  exportToJSON, 
  exportToHTML,
  exportAllSlides,
  importFromJSON,
  importFromPPTX,
  exportSlideAsImage
} from '../utils/exportUtils';

const ImportExport = ({ onClose }) => {
  const { slides, setSlides } = usePresentation();
  const [activeTab, setActiveTab] = useState('export');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = async (format, filename) => {
    setIsProcessing(true);
    try {
      switch (format) {
        case 'pptx':
          exportToPPTX(slides, filename);
          break;
        case 'pdf':
          exportToPDF(slides, filename);
          break;
        case 'json':
          exportToJSON(slides, filename);
          break;
        case 'html':
          exportToHTML(slides, filename);
          break;
        case 'images':
          await exportAllSlides(slides, 'png');
          break;
        default:
          console.error('Unsupported format:', format);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async (file) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      let importedSlides = [];
      
      if (file.name.endsWith('.json')) {
        importedSlides = await importFromJSON(file);
      } else if (file.name.endsWith('.pptx')) {
        importedSlides = await importFromPPTX(file);
      } else {
        throw new Error('Unsupported file format');
      }
      
      if (importedSlides.length > 0) {
        setSlides(importedSlides);
        alert(`Successfully imported ${importedSlides.length} slides!`);
        onClose();
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Import failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportFormats = [
    { id: 'pptx', name: 'PowerPoint (.pptx)', icon: '📊', desc: 'Compatible with Microsoft PowerPoint' },
    { id: 'pdf', name: 'PDF Document (.pdf)', icon: '📄', desc: 'Portable document format' },
    { id: 'html', name: 'Web Page (.html)', icon: '🌐', desc: 'Viewable in any web browser' },
    { id: 'json', name: 'EtherXPPT (.json)', icon: '💾', desc: 'Native format with full features' },
    { id: 'images', name: 'Image Archive (.zip)', icon: '🖼️', desc: 'All slides as PNG images' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="modal w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-4 modal-header">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium" style={{ color: 'var(--accent-gold)' }}>
              Import & Export
            </h3>
            <button
              onClick={onClose}
              className="btn-ghost"
              aria-label="Close import export modal"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mt-4">
            <button
              onClick={() => setActiveTab('export')}
              className="px-4 py-2 text-sm font-medium"
              style={
                activeTab === 'export'
                  ? { borderBottom: '2px solid var(--accent-gold)', color: 'var(--accent-gold)' }
                  : { color: 'rgba(255,255,255,0.75)' }
              }
            >
              Export
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className="px-4 py-2 text-sm font-medium"
              style={
                activeTab === 'import'
                  ? { borderBottom: '2px solid var(--accent-gold)', color: 'var(--accent-gold)' }
                  : { color: 'rgba(255,255,255,0.75)' }
              }
            >
              Import
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Export your presentation in various formats
              </p>
              
              {exportFormats.map((format) => (
                <div
                  key={format.id}
                  className="flex items-center justify-between p-3 rounded-lg card"
                  style={{ border: '1px solid rgba(240,165,0,0.06)' }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{format.icon}</span>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-light)' }}>
                        {format.name}
                      </div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        {format.desc}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleExport(format.id, `presentation.${format.id === 'images' ? 'zip' : format.id}`)}
                    disabled={isProcessing}
                    className="btn-primary"
                  >
                    {isProcessing ? '...' : 'Export'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Import presentations from various formats
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.pptx"
                onChange={(e) => handleImport(e.target.files[0])}
                className="hidden"
              />
              
              <div className="space-y-3">
                <div className="p-4 border-2 border-dashed rounded-lg text-center card" style={{ borderColor: 'rgba(240,165,0,0.08)' }}>
                  <div className="text-4xl mb-2">📁</div>
                  <div className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Drag and drop files here or click to browse
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="btn-primary"
                  >
                    {isProcessing ? 'Processing...' : 'Choose File'}
                  </button>
                </div>

                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.62)' }}>
                  <strong>Supported formats:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• .json - EtherXPPT native format (full compatibility)</li>
                    <li>• .pptx - PowerPoint presentations (basic import)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-[rgba(27,26,23,0.85)] flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 mx-auto mb-2" style={{ borderTop: '3px solid var(--accent-gold)', borderRight: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: '3px solid transparent' }}></div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Processing...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportExport;