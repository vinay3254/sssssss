import React, { useState } from 'react';

const TableToolbar = ({ selectedElement, onUpdate, selectedCells = [] }) => {
  const [showThemes, setShowThemes] = useState(false);

  if (!selectedElement || selectedElement.type !== 'table') return null;

  const tableThemes = [
    { id: 'default', name: 'Default', preview: '#F3F4F6' },
    { id: 'header-accent', name: 'Header Accent', preview: '#3B82F6' },
    { id: 'light-stripes', name: 'Light Stripes', preview: '#F9FAFB' },
    { id: 'bold-header', name: 'Bold Header', preview: '#1F2937' },
    { id: 'no-border', name: 'No Border', preview: '#FFFFFF' },
    { id: 'strong-border', name: 'Strong Border', preview: '#000000' }
  ];

  const applyTheme = (themeId) => {
    const styles = { ...selectedElement.styles };
    
    switch (themeId) {
      case 'header-accent':
        // Header row with accent color
        if (!styles.cellBackground[0]) styles.cellBackground[0] = [];
        for (let i = 0; i < selectedElement.cols; i++) {
          styles.cellBackground[0][i] = '#3B82F6';
        }
        if (!styles.cellTextColor[0]) styles.cellTextColor[0] = [];
        for (let i = 0; i < selectedElement.cols; i++) {
          styles.cellTextColor[0][i] = '#FFFFFF';
        }
        break;
        
      case 'light-stripes':
        // Alternate row colors
        for (let row = 1; row < selectedElement.rows; row += 2) {
          if (!styles.cellBackground[row]) styles.cellBackground[row] = [];
          for (let col = 0; col < selectedElement.cols; col++) {
            styles.cellBackground[row][col] = '#F9FAFB';
          }
        }
        break;
        
      case 'bold-header':
        // Bold dark header
        if (!styles.cellBackground[0]) styles.cellBackground[0] = [];
        if (!styles.cellTextColor[0]) styles.cellTextColor[0] = [];
        for (let i = 0; i < selectedElement.cols; i++) {
          styles.cellBackground[0][i] = '#1F2937';
          styles.cellTextColor[0][i] = '#FFFFFF';
        }
        break;
        
      case 'no-border':
        // Remove all borders
        styles.cellBorder = { width: [], color: [], style: [] };
        break;
        
      case 'strong-border':
        // Strong borders
        for (let row = 0; row < selectedElement.rows; row++) {
          if (!styles.cellBorder.width[row]) styles.cellBorder.width[row] = [];
          if (!styles.cellBorder.color[row]) styles.cellBorder.color[row] = [];
          if (!styles.cellBorder.style[row]) styles.cellBorder.style[row] = [];
          for (let col = 0; col < selectedElement.cols; col++) {
            styles.cellBorder.width[row][col] = '2px';
            styles.cellBorder.color[row][col] = '#000000';
            styles.cellBorder.style[row][col] = 'solid';
          }
        }
        break;
    }
    
    styles.theme = themeId;
    onUpdate({ styles });
    setShowThemes(false);
  };

  const setBorderStyle = (style) => {
    if (selectedCells.length === 0) return;
    
    const styles = { ...selectedElement.styles };
    selectedCells.forEach(cellKey => {
      const [row, col] = cellKey.split('-').map(Number);
      if (!styles.cellBorder.style[row]) styles.cellBorder.style[row] = [];
      styles.cellBorder.style[row][col] = style;
    });
    
    onUpdate({ styles });
  };

  const setBorderWidth = (width) => {
    if (selectedCells.length === 0) return;
    
    const styles = { ...selectedElement.styles };
    selectedCells.forEach(cellKey => {
      const [row, col] = cellKey.split('-').map(Number);
      if (!styles.cellBorder.width[row]) styles.cellBorder.width[row] = [];
      styles.cellBorder.width[row][col] = width;
    });
    
    onUpdate({ styles });
  };

  return (
    <div className="panel p-3">
      <h4 className="text-sm font-medium nav-title mb-3">Table Formatting</h4>
      
      {/* Table Themes */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-neutral-300 mb-2">Table Themes</label>
        <div className="relative">
          <button
            onClick={() => setShowThemes(!showThemes)}
            className="btn-secondary w-full text-left flex items-center justify-between"
          >
            <span>Choose Theme</span>
            <span>▼</span>
          </button>
          
          {showThemes && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              {tableThemes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => applyTheme(theme.id)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: theme.preview }}
                  />
                  <span className="text-sm">{theme.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Border Controls */}
      {selectedCells.length > 0 && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">Border Style</label>
            <div className="flex gap-1">
              <button
                onClick={() => setBorderStyle('solid')}
                className="btn-secondary flex-1 text-xs"
                title="Solid Border"
              >
                ━━━
              </button>
              <button
                onClick={() => setBorderStyle('dashed')}
                className="btn-secondary flex-1 text-xs"
                title="Dashed Border"
              >
                ┅┅┅
              </button>
              <button
                onClick={() => setBorderStyle('double')}
                className="btn-secondary flex-1 text-xs"
                title="Double Border"
              >
                ═══
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">Border Width</label>
            <div className="flex gap-1">
              <button
                onClick={() => setBorderWidth('1px')}
                className="btn-secondary flex-1 text-xs"
              >
                Thin
              </button>
              <button
                onClick={() => setBorderWidth('2px')}
                className="btn-secondary flex-1 text-xs"
              >
                Medium
              </button>
              <button
                onClick={() => setBorderWidth('3px')}
                className="btn-secondary flex-1 text-xs"
              >
                Thick
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableToolbar;