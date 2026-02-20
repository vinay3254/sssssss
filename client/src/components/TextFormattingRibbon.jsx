import React, { useState, useEffect } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const TextFormattingRibbon = ({ selectedElement, onFormatChange, applyFormatToSelection }) => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('12');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [selectedList, setSelectedList] = useState('bullet');
  const [alignment, setAlignment] = useState('left');
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
  const [hasTextSelection, setHasTextSelection] = useState(false);
  const [savedSelection, setSavedSelection] = useState(null);

  // Track text selection changes within contentEditable areas
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setHasTextSelection(false);
        return;
      }
      
      const selectedText = selection.toString();
      if (selectedText.length === 0) {
        setHasTextSelection(false);
        return;
      }
      
      // Save the selection range when there's a valid selection
      if (selection.rangeCount > 0) {
        setSavedSelection(selection.getRangeAt(0));
      }
      
      // Check if selection is within a contentEditable element
      let node = selection.anchorNode;
      while (node && node.nodeType !== Node.DOCUMENT_NODE) {
        if (node.contentEditable === 'true' || node.isContentEditable) {
          setHasTextSelection(true);
          return;
        }
        node = node.parentElement || node.parentNode;
      }
      
      // Also check if selection is within the slide editor area
      const editorArea = document.querySelector('.editor-wrapper, .slide-canvas, [contenteditable]');
      if (editorArea && editorArea.contains(selection.anchorNode)) {
        setHasTextSelection(true);
        return;
      }
      
      setHasTextSelection(false);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // Restore selection when needed
  const restoreSelection = () => {
    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
      return true;
    }
    return false;
  };

  // Microsoft PowerPoint style color palettes
  const themeTextColors = [
    ['#000000', '#44546A', '#5B9BD5', '#0070C0', '#002060', '#7030A0'],
    ['#FFFFFF', '#D9D9D9', '#FFC000', '#ED7D31', '#A5A5A5', '#3F3F3F'],
    ['#FF0000', '#00B0F0', '#92D050', '#FFFF00', '#E26B0A', '#9BBB59']
  ];

  const standardTextColors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6600', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF',
    '#800000', '#808000', '#008000', '#008080', '#000080', '#800080'
  ];

  const themeHighlightColors = [
    ['#FFFF00', '#FFFC99', '#FFF400', '#FFC000', '#F7D062', '#F39F3A'],
    ['#E2F1A1', '#D5E8A5', '#9BD18B', '#5B9BD5', '#4472C4', '#2E75B6'],
    ['#F2DCDB', '#E7B8B7', '#D9D9D9', '#BFBFBF', '#8EA9DB', '#5C7CA3']
  ];

  const standardHighlightColors = [
    '#FFFFFF', '#000000', '#FF0000', '#FF6600', '#FFFF00', '#00FF00',
    '#00FFFF', '#0000FF', '#800000', '#808000', '#008000', '#008080'
  ];

  const fontFamilies = [
    'Arial', 'Calibri', 'Times New Roman', 'Helvetica', 'Georgia', 
    'Verdana', 'Tahoma', 'Comic Sans MS', 'Impact', 'Trebuchet MS'
  ];

  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

  // Keyboard shortcuts for text formatting
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle Ctrl/Cmd shortcuts, don't interfere with normal typing
      if (!(e.ctrlKey || e.metaKey)) return;
      
      if (['b', 'B'].includes(e.key)) {
        e.preventDefault();
        document.execCommand('bold', false, null);
        setIsBold(document.queryCommandState('bold'));
      } else if (['i', 'I'].includes(e.key)) {
        e.preventDefault();
        document.execCommand('italic', false, null);
        setIsItalic(document.queryCommandState('italic'));
      } else if (['u', 'U'].includes(e.key)) {
        e.preventDefault();
        document.execCommand('underline', false, null);
        setIsUnderline(document.queryCommandState('underline'));
      } else if (['l', 'L'].includes(e.key)) {
        e.preventDefault();
        handleAlignmentChange('left');
      } else if (['e', 'E'].includes(e.key)) {
        e.preventDefault();
        handleAlignmentChange('center');
      } else if (['r', 'R'].includes(e.key)) {
        e.preventDefault();
        handleAlignmentChange('right');
      } else if (['j', 'J'].includes(e.key)) {
        e.preventDefault();
        handleAlignmentChange('justify');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFontFamilyChange = (family) => {
    setFontFamily(family);
    applyFormatToSelection?.('fontName', family);
    onFormatChange?.({ fontFamily: family });
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    applyFormatToSelection?.('fontSize', size);
    onFormatChange?.({ fontSize: `${size}px` });
  };

  const handleUpperCase = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString().toUpperCase();
      const textNode = document.createTextNode(text);
      range.deleteContents();
      range.insertNode(textNode);
      
      // Restore selection
      const newRange = document.createRange();
      newRange.selectNodeContents(textNode);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  };

  const handleLowerCase = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString().toLowerCase();
      const textNode = document.createTextNode(text);
      range.deleteContents();
      range.insertNode(textNode);
      
      // Restore selection
      const newRange = document.createRange();
      newRange.selectNodeContents(textNode);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  };

  const toggleBold = (e) => {
    e.preventDefault();
    document.execCommand('bold', false, null);
    setIsBold(document.queryCommandState('bold'));
  };

  const toggleItalic = (e) => {
    e.preventDefault();
    document.execCommand('italic', false, null);
    setIsItalic(document.queryCommandState('italic'));
  };

  const toggleUnderline = (e) => {
    e.preventDefault();
    document.execCommand('underline', false, null);
    setIsUnderline(document.queryCommandState('underline'));
  };

  const toggleStrikethrough = (e) => {
    e.preventDefault();
    document.execCommand('strikeThrough', false, null);
    setIsStrikethrough(document.queryCommandState('strikeThrough'));
  };

  const handleListChange = (listType) => {
    setSelectedList(listType);
    setShowListDropdown(false);
    
    // Get current selection at the time of click
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      // Try to find any contentEditable element in the slide canvas
      const editableElement = document.querySelector('.slide-canvas [contenteditable="true"]');
      if (editableElement) {
        applyListFormatting(listType, editableElement);
      }
      return;
    }
    
    const selectedText = selection.toString();
    
    // Find contentEditable element from selection
    let editableElement = selection.anchorNode;
    while (editableElement && editableElement !== document.body) {
      if (editableElement.contentEditable === 'true' || editableElement.isContentEditable) {
        break;
      }
      editableElement = editableElement.parentElement || editableElement.parentNode;
    }
    
    // If no contentEditable found in selection, try slide canvas
    if (!editableElement || editableElement === document.body) {
      editableElement = document.querySelector('.slide-canvas [contenteditable="true"]');
    }
    
    if (!editableElement) return;
    
    applyListFormatting(listType, editableElement, selectedText);
  };

  const applyListFormatting = (listType, editableElement, selectedText = '') => {
    // First, make sure the element is focused to apply formatting
    editableElement.focus();
    
    let newContent = '';
    
    if (listType === 'bullet') {
      // Get current text - use selected text or all text
      let text = selectedText;
      if (!text || !text.trim()) {
        text = editableElement.textContent || '';
      }
      
      const lines = text.split('\n').filter(l => l.trim());
      
      if (lines.length > 0) {
        const listItems = lines.map(line => {
          // Clean existing bullet/number prefixes
          const cleanLine = line.replace(/^[•★→\d+A-Za-z]\.?\s*/, '');
          return `<li style="list-style-type: disc; margin-left: 20px;">${cleanLine}</li>`;
        }).join('');
        newContent = `<ul style="list-style-type: disc;">${listItems}</ul>`;
      }
    } else if (listType === 'numeric') {
      // Get current text
      let text = selectedText;
      if (!text || !text.trim()) {
        text = editableElement.textContent || '';
      }
      
      const lines = text.split('\n').filter(l => l.trim());
      
      if (lines.length > 0) {
        const listItems = lines.map((line, index) => {
          const cleanLine = line.replace(/^[•★→\d+A-Za-z]\.?\s*/, '');
          return `<li style="list-style-type: decimal; margin-left: 20px;">${cleanLine}</li>`;
        }).join('');
        newContent = `<ol style="list-style-type: decimal;">${listItems}</ol>`;
      }
    } else if (listType === 'alphabetic') {
      // Get current text
      let text = selectedText;
      if (!text || !text.trim()) {
        text = editableElement.textContent || '';
      }
      
      const lines = text.split('\n').filter(l => l.trim());
      
      if (lines.length > 0) {
        const listItems = lines.map(line => {
          const cleanLine = line.replace(/^[•★→\d+A-Za-z]\.?\s*/, '');
          return `<li style="list-style-type: upper-alpha; margin-left: 20px;">${cleanLine}</li>`;
        }).join('');
        newContent = `<ol style="list-style-type: upper-alpha; padding-left: 30px;">${listItems}</ol>`;
      }
    } else if (listType === 'stars') {
      // Custom list with stars - convert text to list format
      let text = selectedText;
      if (!text || !text.trim()) {
        text = editableElement.textContent || '';
      }
      
      const lines = text.split('\n').filter(l => l.trim());
      
      if (lines.length > 0) {
        newContent = lines.map(line => {
          const cleanLine = line.replace(/^[•★→\d+A-Za-z]\.?\s*/, '');
          return `<div style="margin-left: 20px;">★ ${cleanLine}</div>`;
        }).join('');
      }
    } else if (listType === 'arrows') {
      // Custom list with arrows - convert text to list format
      let text = selectedText;
      if (!text || !text.trim()) {
        text = editableElement.textContent || '';
      }
      
      const lines = text.split('\n').filter(l => l.trim());
      
      if (lines.length > 0) {
        newContent = lines.map(line => {
          const cleanLine = line.replace(/^[•★→\d+A-Za-z]\.?\s*/, '');
          return `<div style="margin-left: 20px;">→ ${cleanLine}</div>`;
        }).join('');
      }
    }
    
    if (newContent) {
      // Replace the content
      editableElement.innerHTML = newContent;
    }
    
    // Get the updated content and save to slide
    const updatedContent = editableElement.innerHTML;
    
    // Try to determine which field based on data-field attribute
    const dataField = editableElement.getAttribute('data-field');
    
    if (dataField === 'title') {
      updateSlide(currentSlide, { title: updatedContent });
    } else if (dataField === 'content') {
      updateSlide(currentSlide, { content: updatedContent });
    } else if (dataField === 'leftContent') {
      updateSlide(currentSlide, { leftContent: updatedContent });
    } else if (dataField === 'rightContent') {
      updateSlide(currentSlide, { rightContent: updatedContent });
    } else {
      // Fallback - update content field
      updateSlide(currentSlide, { content: updatedContent });
    }
  };

  const handleAlignmentChange = (align) => {
    // Restore selection before applying formatting
    if (!restoreSelection()) {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;
    }
    
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    // Find contentEditable or apply to focused element
    let element = selection.focusNode;
    while (element && element.nodeType !== Node.ELEMENT_NODE) {
      element = element.parentElement || element.parentNode;
    }
    
    // Check for contentEditable using both methods
    while (element && element !== document.body) {
      if (element.contentEditable === 'true' || element.isContentEditable) {
        // Apply alignment using style for better control
        element.style.textAlign = align;
        setAlignment(align);
        return;
      }
      element = element.parentElement || element.parentNode;
    }

    // Fallback to execCommand
    const cmd = align === 'left' ? 'justifyLeft' : align === 'center' ? 'justifyCenter' : align === 'right' ? 'justifyRight' : 'justifyFull';
    document.execCommand(cmd, false, null);
    setAlignment(align);
  };

  const handleTextColor = (color) => {
    if (color) {
      applyFormatToSelection?.('foreColor', color);
    }
  };

  const handleHighlightColor = (color) => {
    if (color) {
      applyFormatToSelection?.('backColor', color);
    }
  };

  const handleInsertElement = (elementType) => {
    if (elementType === 'image') {
      handleImageUpload();
      return;
    }
    
    if (elementType === 'chart') {
      handleChartSelection();
      return;
    }
    
    if (elementType === 'table') {
      handleTableCreation();
      return;
    }
    
    const slide = slides[currentSlide];
    const elements = slide.elements || [];
    
    const newElement = {
      id: Date.now(),
      type: elementType,
      x: 100,
      y: 100,
      width: elementType === 'textbox' ? 200 : 250,
      height: elementType === 'textbox' ? 100 : 150,
      content: elementType === 'textbox' ? 'New text' : elementType === 'equation' ? 'E = mc²' : '',
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#000000',
      shapeType: elementType === 'shape' ? 'rectangle' : undefined,
      fill: elementType === 'shape' ? '#3B82F6' : undefined,
      stroke: elementType === 'shape' ? '#1E40AF' : undefined,
      strokeWidth: elementType === 'shape' ? 2 : undefined
    };
    
    const updatedElements = [...elements, newElement];
    updateSlide(currentSlide, { elements: updatedElements });
  };

  const handleTableCreation = () => {
    const rows = prompt('Enter number of rows (1-10):') || '3';
    const cols = prompt('Enter number of columns (1-10):') || '3';
    
    const numRows = Math.min(Math.max(parseInt(rows), 1), 10);
    const numCols = Math.min(Math.max(parseInt(cols), 1), 10);
    
    const slide = slides[currentSlide];
    const elements = slide.elements || [];
    
    const newElement = {
      id: Date.now(),
      type: 'table',
      x: 100,
      y: 100,
      width: numCols * 80,
      height: numRows * 40,
      rows: numRows,
      cols: numCols,
      data: Array(numRows).fill().map(() => Array(numCols).fill('Cell'))
    };
    
    const updatedElements = [...elements, newElement];
    updateSlide(currentSlide, { elements: updatedElements });
  };

  const handleChartSelection = () => {
    const chartType = prompt('Select chart type:\n1. Pie Chart\n2. Doughnut Chart\n3. Bar Chart\n4. Line Chart\n\nEnter 1, 2, 3, or 4:');
    
    const chartTypes = {
      '1': 'pie',
      '2': 'doughnut', 
      '3': 'bar',
      '4': 'line'
    };
    
    const selectedType = chartTypes[chartType] || 'pie';
    
    const slide = slides[currentSlide];
    const elements = slide.elements || [];
    
    const newElement = {
      id: Date.now(),
      type: 'chart',
      chartType: selectedType,
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Sample Data',
          color: '#3B82F6',
          data: [30, 45, 60, 40]
        }]
      },
      options: { legend: true, dataLabels: true },
      x: 100,
      y: 100,
      width: 400,
      height: 300,
      title: 'Sample Chart'
    };
    
    const updatedElements = [...elements, newElement];
    updateSlide(currentSlide, { elements: updatedElements });
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const slide = slides[currentSlide];
          const elements = slide.elements || [];
          
          const newElement = {
            id: Date.now(),
            type: 'image',
            x: 100,
            y: 100,
            width: 300,
            height: 200,
            src: event.target.result,
            alt: file.name
          };
          
          const updatedElements = [...elements, newElement];
          updateSlide(currentSlide, { elements: updatedElements });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const listTypes = [
    { value: 'bullet', label: 'Bullet Points', icon: '•' },
    { value: 'numeric', label: 'Numeric', icon: '1.' },
    { value: 'alphabetic', label: 'Alphabetic', icon: 'A.' },
    { value: 'stars', label: 'Stars', icon: '★' },
    { value: 'arrows', label: 'Arrows', icon: '→' }
  ];

  // Get the current list type label for display
  const getCurrentListLabel = () => {
    const current = listTypes.find(l => l.value === selectedList);
    return current ? current.icon : '•';
  };

  // Close dropdown when clicking outside - but not when clicking on dropdown options
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showListDropdown && !e.target.closest('.list-dropdown-container')) {
        setShowListDropdown(false);
      }
    };
    
    // Use setTimeout to allow dropdown option clicks to fire first
    const timeoutId = setTimeout(() => {
      if (showListDropdown) {
        document.addEventListener('mousedown', handleClickOutside);
      }
    }, 0);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showListDropdown]);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-2 shadow-sm">
      <div className="flex items-center gap-2 flex-wrap">
        
        {/* List Formatting Dropdown */}
        <div className="relative list-dropdown-container">
          <button
            onClick={() => setShowListDropdown(!showListDropdown)}
            className="w-14 px-1 py-0.5 text-[10px] border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-300 flex items-center justify-between bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            title="List Formatting"
          >
            <span>{getCurrentListLabel()}</span>
            <span className="text-[8px] ml-1">▼</span>
          </button>
          
          {/* Dropdown Menu */}
          {showListDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm shadow-lg z-50 py-1">
              {listTypes.map((listType) => (
                <button
                  key={listType.value}
                  onClick={() => handleListChange(listType.value)}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                    selectedList === listType.value 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="w-4 text-center">{listType.icon}</span>
                  <span>{listType.label.replace(/^[•★→\d+A-Z]\.\s*/, '')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Formatting Buttons */}
        <div className="flex items-center gap-1 border-l border-gray-300 dark:border-gray-600 pl-2">
          {/* Bold Button */}
          <button
            onClick={toggleBold}
            className={`p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isBold ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          
          {/* Italic Button */}
          <button
            onClick={toggleItalic}
            className={`p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isItalic ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          
          {/* Underline Button */}
          <button
            onClick={toggleUnderline}
            className={`p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isUnderline ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>
          
          {/* Strikethrough Button */}
          <button
            onClick={toggleStrikethrough}
            className={`p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isStrikethrough ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        {/* Alignment Buttons */}
        <div className="flex items-center gap-1 border-l border-gray-300 dark:border-gray-600 pl-2">
          <button
            onClick={() => handleAlignmentChange('left')}
            className={`p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${alignment === 'left' ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            title="Align Left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
            </svg>
          </button>
          <button
            onClick={() => handleAlignmentChange('center')}
            className={`p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${alignment === 'center' ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            title="Align Center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
            </svg>
          </button>
          <button
            onClick={() => handleAlignmentChange('right')}
            className={`p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${alignment === 'right' ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            title="Align Right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
            </svg>
          </button>
        </div>

        {/* Font Family Dropdown */}
        <div className="relative">
          <select
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
          >
            {fontFamilies.map((family) => (
              <option key={family} value={family}>{family}</option>
            ))}
          </select>
        </div>

        {/* Font Size Dropdown */}
        <div className="relative">
          <select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Text Color Button */}
        <div className="relative">
          <button
            onClick={() => setShowTextColorPicker(!showTextColorPicker)}
            className="p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
            title="Text Color"
          >
            <span className="w-4 h-4 rounded border border-gray-400" style={{ backgroundColor: '#000000' }}></span>
            <span className="text-[8px]">▼</span>
          </button>
          {showTextColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50">
              <div className="grid grid-cols-6 gap-1">
                {standardTextColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      handleTextColor(color);
                      setShowTextColorPicker(false);
                    }}
                    className="w-5 h-5 rounded border-2 border-gray-300 hover:border-gray-500"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Highlight Color Button */}
        <div className="relative">
          <button
            onClick={() => setShowHighlightColorPicker(!showHighlightColorPicker)}
            className="p-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
            title="Highlight Color"
          >
            <span className="w-4 h-4 rounded border border-gray-400" style={{ backgroundColor: '#FFFF00' }}></span>
            <span className="text-[8px]">▼</span>
          </button>
          {showHighlightColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50">
              <div className="grid grid-cols-6 gap-1">
                {standardHighlightColors.slice(0, 12).map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      handleHighlightColor(color);
                      setShowHighlightColorPicker(false);
                    }}
                    className="w-5 h-5 rounded border-2 border-gray-300 hover:border-gray-500"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Case Conversion */}
        <div className="flex items-center gap-1 border-l border-gray-300 dark:border-gray-600 pl-2">
          <button
            onClick={handleUpperCase}
            className="px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
            title="UPPERCASE"
          >
            AA
          </button>
          <button
            onClick={handleLowerCase}
            className="px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
            title="lowercase"
          >
            aa
          </button>
        </div>

      </div>
    </div>
  );
};

export default TextFormattingRibbon;