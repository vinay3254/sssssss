import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const TableComponent = ({ onClose }) => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [tableData, setTableData] = useState(
    Array(3).fill().map(() => Array(3).fill(''))
  );

  const updateTableSize = (newRows, newCols) => {
    const newData = Array(newRows).fill().map((_, i) => 
      Array(newCols).fill().map((_, j) => 
        tableData[i]?.[j] || ''
      )
    );
    setTableData(newData);
    setRows(newRows);
    setCols(newCols);
  };

  const updateCell = (row, col, value) => {
    const newData = [...tableData];
    newData[row][col] = value;
    setTableData(newData);
  };

  const addTable = () => {
    const newElement = {
      id: Date.now(),
      type: 'table',
      data: tableData,
      rows,
      cols,
      x: 100,
      y: 100,
      width: Math.max(200, cols * 100),
      height: Math.max(100, rows * 40),
      scale: 1,
      mergedCells: {},
      styles: {
        cellBackground: [],
        cellBorder: {
          width: [],
          color: [],
          style: []
        },
        cellTextColor: [],
        theme: null
      }
    };
    
    const elements = slides[currentSlide].elements || [];
    updateSlide(currentSlide, { elements: [...elements, newElement] });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="modal w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-4 modal-header">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium" style={{ color: 'var(--accent-gold)' }}>Insert Table</h3>
            <button onClick={onClose} className="btn-ghost" aria-label="Close insert table">✕</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-light)' }}>Rows</label>
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => updateTableSize(parseInt(e.target.value), cols)}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-light)' }}>Columns</label>
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => updateTableSize(rows, parseInt(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-light)' }}>Table Preview</label>
            <div className="border rounded-md overflow-hidden card" style={{ border: '1px solid rgba(240,165,0,0.06)' }}>
              <table className="w-full text-sm">
                <tbody>
                  {tableData.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="p-1" style={{ border: i === 0 ? 'none' : '1px solid rgba(240,165,0,0.06)', background: i === 0 ? 'var(--accent-gold)' : 'transparent', color: i === 0 ? 'var(--primary-dark)' : 'var(--text-light)' }}>
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => updateCell(i, j, e.target.value)}
                            placeholder={i === 0 ? `Header ${j + 1}` : `Cell ${i + 1},${j + 1}`}
                            className="w-full px-1 py-0.5 text-xs border-none outline-none bg-transparent"
                            style={{ color: i === 0 ? 'var(--primary-dark)' : 'var(--text-light)' }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4" style={{ borderTop: '1px solid rgba(240,165,0,0.06)' }}>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={addTable}
              className="btn-primary"
            >
              Insert Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;