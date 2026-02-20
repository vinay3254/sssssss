import React, { useState, useRef, useEffect } from 'react';

const AdvancedTableEditor = ({ element, onUpdate, onDelete, isSelected, onSelect, onCellSelect }) => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [isEditingCell, setIsEditingCell] = useState(false);
  const tableRef = useRef(null);

  const tableData = element.data || [];
  const styles = element.styles || {
    cellBackground: [],
    cellBorder: { width: [], color: [], style: [] },
    cellTextColor: [],
    theme: null
  };

  const handleCellClick = (rowIndex, colIndex, e) => {
    e.stopPropagation();
    setIsEditingCell(true);

    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      const cellKey = `${rowIndex}-${colIndex}`;
      if (selectedCells.includes(cellKey)) {
        setSelectedCells(selectedCells.filter(c => c !== cellKey));
      } else {
        setSelectedCells([...selectedCells, cellKey]);
      }
    } else {
      // Single select
      setSelectedCells([`${rowIndex}-${colIndex}`]);
    }

    // Show toolbar
    const rect = e.target.getBoundingClientRect();
    setToolbarPosition({ x: rect.left, y: rect.top - 50 });
    setShowToolbar(true);

    // Focus the cell for editing
    const cell = e.target.closest('td');
    if (cell) {
      cell.focus();
    }

    onCellSelect({ rowIndex, colIndex });
  };

  const handleTableClick = (e) => {
    // Only select table if clicking on table border/background, not cells
    if (e.target.tagName === 'TABLE' || e.target.tagName === 'TBODY' || e.target.tagName === 'TR') {
      onSelect();
    }
  };

  // Removed updateCellContent function as updates are now handled directly in event handlers

  const addRow = (afterIndex) => {
    const newData = [...tableData];
    const newRow = Array(element.cols || 3).fill('');
    newData.splice(afterIndex + 1, 0, newRow);
    onUpdate({ 
      data: newData, 
      rows: (element.rows || 3) + 1 
    });
  };

  const addColumn = (afterIndex) => {
    const newData = tableData.map(row => {
      const newRow = [...(row || [])];
      newRow.splice(afterIndex + 1, 0, '');
      return newRow;
    });
    onUpdate({ 
      data: newData, 
      cols: (element.cols || 3) + 1 
    });
  };

  const deleteRow = (rowIndex) => {
    if (tableData.length <= 1) return;
    const newData = tableData.filter((_, i) => i !== rowIndex);
    onUpdate({ 
      data: newData, 
      rows: Math.max(1, (element.rows || 3) - 1) 
    });
  };

  const deleteColumn = (colIndex) => {
    const maxCols = Math.max(...tableData.map(row => row?.length || 0));
    if (maxCols <= 1) return;
    const newData = tableData.map(row => 
      (row || []).filter((_, i) => i !== colIndex)
    );
    onUpdate({ 
      data: newData, 
      cols: Math.max(1, (element.cols || 3) - 1) 
    });
  };

  const setCellStyle = (property, value) => {
    const newStyles = { ...styles };
    
    selectedCells.forEach(cellKey => {
      const [row, col] = cellKey.split('-').map(Number);
      
      if (property === 'backgroundColor') {
        if (!newStyles.cellBackground[row]) newStyles.cellBackground[row] = [];
        newStyles.cellBackground[row][col] = value;
      } else if (property === 'color') {
        if (!newStyles.cellTextColor[row]) newStyles.cellTextColor[row] = [];
        newStyles.cellTextColor[row][col] = value;
      } else if (property.startsWith('border')) {
        const borderProp = property.replace('border', '').toLowerCase();
        if (!newStyles.cellBorder[borderProp]) newStyles.cellBorder[borderProp] = [];
        if (!newStyles.cellBorder[borderProp][row]) newStyles.cellBorder[borderProp][row] = [];
        newStyles.cellBorder[borderProp][row][col] = value;
      }
    });
    
    onUpdate({ styles: newStyles });
  };

  const mergeCells = () => {
    if (selectedCells.length < 2) return;
    
    const newMergedCells = { ...element.mergedCells };
    const mergeKey = selectedCells.sort().join(',');
    newMergedCells[mergeKey] = {
      cells: selectedCells,
      content: tableData[selectedCells[0].split('-')[0]][selectedCells[0].split('-')[1]] || ''
    };
    
    onUpdate({ mergedCells: newMergedCells });
    setSelectedCells([]);
  };

  const splitCells = () => {
    const newMergedCells = { ...element.mergedCells };
    
    Object.keys(newMergedCells).forEach(key => {
      const merge = newMergedCells[key];
      if (merge.cells.some(cell => selectedCells.includes(cell))) {
        delete newMergedCells[key];
      }
    });
    
    onUpdate({ mergedCells: newMergedCells });
  };

  const applyTheme = (theme) => {
    const newStyles = { ...styles, theme };
    
    // Apply theme-specific styles
    const themeStyles = {
      'header-accent': {
        headerBg: '#3B82F6',
        headerText: '#FFFFFF',
        alternateRows: true
      },
      'light-stripes': {
        alternateRows: true,
        stripeBg: '#F9FAFB'
      },
      'bold-header': {
        headerBg: '#1F2937',
        headerText: '#FFFFFF',
        headerBold: true
      }
    };
    
    if (themeStyles[theme]) {
      // Apply theme logic here
      onUpdate({ styles: newStyles });
    }
  };

  const getCellStyle = (rowIndex, colIndex) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    const isSelectedCell = selectedCells.includes(cellKey);
    
    return {
      backgroundColor: styles.cellBackground?.[rowIndex]?.[colIndex] || 
                     (rowIndex === 0 ? '#F3F4F6' : '#FFFFFF'),
      color: styles.cellTextColor?.[rowIndex]?.[colIndex] || '#000000',
      border: isSelectedCell ? '2px solid #3B82F6' : '1px solid #D1D5DB',
      fontWeight: rowIndex === 0 ? 'bold' : 'normal'
    };
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tableRef.current && !tableRef.current.contains(e.target)) {
        setShowToolbar(false);
        setSelectedCells([]);
        setIsEditingCell(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full h-full">
      <table 
        ref={tableRef}
        className="border-collapse w-full h-full"
        onClick={handleTableClick}
      >
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {(row || []).map((cell, colIndex) => (
                <td
                  key={colIndex}
                  contentEditable={true}
                  spellCheck={true}
                  suppressContentEditableWarning={true}
                  style={getCellStyle(rowIndex, colIndex)}
                  className="p-2 min-w-[60px] min-h-[30px] border cursor-text outline-none focus:bg-blue-50 focus:border-blue-500"
                  data-row={rowIndex}
                  data-col={colIndex}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCellClick(rowIndex, colIndex, e);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onBlur={(e) => {
                    // Save content on blur
                    const content = e.target.innerHTML;
                    const newData = [...tableData];
                    if (!newData[rowIndex]) newData[rowIndex] = [];
                    newData[rowIndex][colIndex] = content;
                    onUpdate({ data: newData });
                  }}
                  onKeyDown={(e) => {
                    // Prevent canvas shortcuts but allow regular typing and common editing shortcuts
                    if (e.ctrlKey || e.metaKey) {
                      // Allow common editing shortcuts
                      if (['a', 'c', 'v', 'x', 'z', 'y', 'b', 'i', 'u'].includes(e.key.toLowerCase())) {
                        return; // Allow these
                      }
                      // Stop other Ctrl/Cmd shortcuts from reaching canvas
                      e.stopPropagation();
                    }
                    // Allow all regular typing and navigation keys
                  }}
                  dangerouslySetInnerHTML={{ __html: cell || (rowIndex === 0 ? `Header ${colIndex + 1}` : '') }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mini Toolbar */}
      {showToolbar && selectedCells.length > 0 && (
        <div 
          className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex items-center gap-2"
          style={{ left: toolbarPosition.x, top: toolbarPosition.y }}
        >
          <input
            type="color"
            defaultValue="#FFFFFF"
            onChange={(e) => setCellStyle('backgroundColor', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border"
            title="Fill Color"
          />
          <input
            type="color"
            defaultValue="#000000"
            onChange={(e) => setCellStyle('color', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border"
            title="Text Color"
          />
          <button
            onClick={() => {
              const [row] = selectedCells[0].split('-').map(Number);
              addRow(row);
            }}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            title="Add Row"
          >
            +Row
          </button>
          <button
            onClick={() => {
              const [, col] = selectedCells[0].split('-').map(Number);
              addColumn(col);
            }}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            title="Add Column"
          >
            +Col
          </button>
          <button
            onClick={() => {
              const [row] = selectedCells[0].split('-').map(Number);
              deleteRow(row);
            }}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            title="Delete Row"
          >
            -Row
          </button>
          <button
            onClick={() => {
              const [, col] = selectedCells[0].split('-').map(Number);
              deleteColumn(col);
            }}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            title="Delete Column"
          >
            -Col
          </button>
          {selectedCells.length > 1 && (
            <button
              onClick={mergeCells}
              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              title="Merge Cells"
            >
              Merge
            </button>
          )}
          <button
            onClick={splitCells}
            className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
            title="Split Cells"
          >
            Split
          </button>
          <button
            onClick={() => {
              const newData = [...tableData];
              selectedCells.forEach(cellKey => {
                const [row, col] = cellKey.split('-').map(Number);
                if (newData[row] && newData[row][col] !== undefined) {
                  newData[row][col] = '';
                }
              });
              onUpdate({ data: newData });
            }}
            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            title="Clear Cell Content"
          >
            Clear
          </button>
        </div>
      )}


    </div>
  );
};

export default AdvancedTableEditor;