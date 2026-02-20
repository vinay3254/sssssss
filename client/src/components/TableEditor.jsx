import React, { useState, useRef, useCallback } from 'react';

const TableEditor = ({ element, onUpdate, onDelete, isSelected, onSelect, onCellSelect }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const tableRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  }, [onSelect]);

  const handleResizeStart = useCallback((e, handle) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    setIsResizing(true);
    setResizeHandle(handle);
  }, [onSelect]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const canvas = e.currentTarget.closest('.slide-canvas');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;

      onUpdate({
        x: Math.max(0, x),
        y: Math.max(0, y)
      });
    }

    if (isResizing && resizeHandle) {
      const canvas = e.currentTarget.closest('.slide-canvas');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let newWidth = element.width;
      let newHeight = element.height;
      let newX = element.x;
      let newY = element.y;

      switch (resizeHandle) {
        case 'se':
          newWidth = Math.max(100, mouseX - element.x);
          newHeight = Math.max(60, mouseY - element.y);
          break;
        case 'ne':
          newWidth = Math.max(100, mouseX - element.x);
          newHeight = Math.max(60, element.y + element.height - mouseY);
          newY = Math.max(0, mouseY);
          break;
        case 'nw':
          newWidth = Math.max(100, element.x + element.width - mouseX);
          newHeight = Math.max(60, element.y + element.height - mouseY);
          newX = Math.max(0, mouseX);
          newY = Math.max(0, mouseY);
          break;
        case 'sw':
          newWidth = Math.max(100, element.x + element.width - mouseX);
          newHeight = Math.max(60, mouseY - element.y);
          newX = Math.max(0, mouseX);
          break;
      }

      onUpdate({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    }
  }, [isDragging, isResizing, resizeHandle, dragOffset, element, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  const handleCellClick = useCallback((rowIndex, colIndex, e) => {
    e.stopPropagation();
    setSelectedCell({ row: rowIndex, col: colIndex });

    // Notify parent about cell selection
    if (onCellSelect) {
      onCellSelect({ rowIndex, colIndex });
    }

    // Focus the cell for editing
    const cell = e.target.closest('td');
    if (cell) {
      cell.focus();
    }
  }, [onCellSelect]);

  const handleCellBlur = useCallback((rowIndex, colIndex, e) => {
    const newData = [...(element.data || [])];
    if (!newData[rowIndex]) newData[rowIndex] = [];
    newData[rowIndex][colIndex] = e.target.innerHTML;

    onUpdate({ data: newData });
  }, [element.data, onUpdate]);

  const handleCellBackgroundChange = useCallback((color) => {
    if (!selectedCell) return;

    const newCellColors = { ...(element.cellColors || {}) };
    const key = `${selectedCell.row}-${selectedCell.col}`;
    newCellColors[key] = color;

    onUpdate({ cellColors: newCellColors });
  }, [selectedCell, element.cellColors, onUpdate]);

  const handleTableBackgroundChange = useCallback((color) => {
    onUpdate({ backgroundColor: color });
  }, [onUpdate]);

  const handleBorderColorChange = useCallback((color) => {
    onUpdate({ borderColor: color });
  }, [onUpdate]);

  // Initialize table data if not exists
  const tableData = element.data || [];
  const rows = element.rows || 3;
  const cols = element.cols || 3;

  // Ensure we have enough data
  const displayData = [];
  for (let i = 0; i < rows; i++) {
    displayData[i] = [];
    for (let j = 0; j < cols; j++) {
      displayData[i][j] = tableData[i]?.[j] || '';
    }
  }

  return (
    <div
      className="ppt-table"
      ref={tableRef}
      data-element-id={element.id}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: 'move',
        border: `2px solid ${element.borderColor || '#444'}`,
        backgroundColor: element.backgroundColor || 'transparent',
        resize: isSelected ? 'both' : 'none',
        overflow: 'auto'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          height: '100%',
          tableLayout: 'fixed'
        }}
      >
        <tbody>
          {displayData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const cellBackground = element.cellColors?.[cellKey] || 'transparent';

                return (
                  <td
                    key={colIndex}
                    contentEditable
                    spellCheck={true}
                    suppressContentEditableWarning={true}
                    data-row={rowIndex}
                    data-col={colIndex}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                    onBlur={(e) => handleCellBlur(rowIndex, colIndex, e)}
                    style={{
                      border: `1px solid ${element.borderColor || '#666'}`,
                      width: `${90 / cols}px`,
                      height: `${40 / rows}px`,
                      padding: '5px',
                      textAlign: 'center',
                      backgroundColor: cellBackground,
                      outline: selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? '2px solid #3b82f6' : 'none',
                      cursor: 'text'
                    }}
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Selection and Resize Handles */}
      {isSelected && (
        <>
          {/* Selection Border */}
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />

          {/* Resize Handles */}
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-nw-resize"
            style={{ left: -6, top: -6 }}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-ne-resize"
            style={{ right: -6, top: -6 }}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-sw-resize"
            style={{ left: -6, bottom: -6 }}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-se-resize"
            style={{ right: -6, bottom: -6 }}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />

          {/* Table Controls */}
          <div className="absolute -top-12 left-0 flex gap-1">
            <input
              type="color"
              value={element.backgroundColor || '#ffffff'}
              onChange={(e) => handleTableBackgroundChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-300"
              title="Table Background Color"
            />
            <input
              type="color"
              value={element.borderColor || '#444'}
              onChange={(e) => handleBorderColorChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-300"
              title="Border Color"
            />
            {selectedCell && (
              <>
                <input
                  type="color"
                  value={element.cellColors?.[`${selectedCell.row}-${selectedCell.col}`] || '#ffffff'}
                  onChange={(e) => handleCellBackgroundChange(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                  title="Cell Background Color"
                />
                <button
                  onClick={() => {
                    const newData = [...(element.data || [])];
                    if (!newData[selectedCell.row]) newData[selectedCell.row] = [];
                    newData[selectedCell.row][selectedCell.col] = '';
                    onUpdate({ data: newData });
                  }}
                  className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                  title="Clear Cell Content"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Delete Button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default TableEditor;