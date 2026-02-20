import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const FormatPanel = () => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [activeTab, setActiveTab] = useState('text');
  
  const slide = slides[currentSlide] || {};

  const handleSlideUpdate = (updates) => {
    updateSlide(currentSlide, updates);
  };

  const formatText = (command, value = null) => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) return;
    
    // Create a span element with the appropriate styling
    const span = document.createElement('span');
    
    // Apply formatting based on command
    switch (command) {
      case 'bold':
        span.style.fontWeight = 'bold';
        break;
      case 'italic':
        span.style.fontStyle = 'italic';
        break;
      case 'underline':
        span.style.textDecoration = 'underline';
        break;
      case 'fontName':
        span.style.fontFamily = value;
        break;
      case 'fontSize':
        span.style.fontSize = value + 'px';
        break;
      case 'foreColor':
        span.style.color = value;
        break;
      case 'justifyLeft':
      case 'justifyCenter':
      case 'justifyRight':
        // For alignment, we need to work with the parent block element
        const container = range.commonAncestorContainer;
        const blockElement = container.nodeType === Node.TEXT_NODE
          ? container.parentElement
          : container;
        
        if (blockElement) {
          const alignment = command === 'justifyLeft' ? 'left'
            : command === 'justifyCenter' ? 'center'
            : 'right';
          blockElement.style.textAlign = alignment;
        }
        return;
      default:
        return;
    }
    
    // Replace the selected text with the formatted span
    span.textContent = selectedText;
    range.deleteContents();
    range.insertNode(span);
    
    // Restore selection
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
  };

  const predefinedColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];

  const themes = [
    { name: 'Default', bg: '#FFFFFF', text: '#000000' },
    { name: 'Dark', bg: '#1F2937', text: '#FFFFFF' },
    { name: 'Blue', bg: '#3B82F6', text: '#FFFFFF' },
    { name: 'Green', bg: '#10B981', text: '#FFFFFF' },
    { name: 'Purple', bg: '#8B5CF6', text: '#FFFFFF' }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Format</h3>
      
      {/* Tab Navigation */}
      <div className="flex mb-4 border-b border-gray-200 dark:border-gray-600">
        <button
          onClick={() => setActiveTab('text')}
          className={`px-3 py-1 text-xs font-medium ${activeTab === 'text' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Text
        </button>
        <button
          onClick={() => setActiveTab('slide')}
          className={`px-3 py-1 text-xs font-medium ${activeTab === 'slide' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Slide
        </button>
      </div>

      {/* Text Formatting Tab */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          {/* Font Family */}
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Font Family</label>
            <select 
              className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) => formatText('fontName', e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Font Size</label>
            <select 
              className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) => formatText('fontSize', e.target.value)}
            >
              <option value="12">12px</option>
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
              <option value="24">24px</option>
              <option value="32">32px</option>
              <option value="48">48px</option>
              <option value="64">64px</option>
            </select>
          </div>

          {/* Text Style Buttons */}
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Text Style</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => formatText('bold')}
                className="p-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => formatText('italic')}
                className="p-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                title="Italic"
              >
                <em>I</em>
              </button>
              <button
                onClick={() => formatText('underline')}
                className="p-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                title="Underline"
              >
                <u>U</u>
              </button>
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Alignment</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => formatText('justifyLeft')}
                className="p-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                title="Align Left"
              >
                ⬅
              </button>
              <button
                onClick={() => formatText('justifyCenter')}
                className="p-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                title="Center"
              >
                ↔
              </button>
              <button
                onClick={() => formatText('justifyRight')}
                className="p-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                title="Align Right"
              >
                ➡
              </button>
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Text Color</label>
            <div className="grid grid-cols-5 gap-1 mb-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => formatText('foreColor', color)}
                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <input
              type="color"
              onChange={(e) => formatText('foreColor', e.target.value)}
              className="w-full h-8 border rounded cursor-pointer"
              title="Custom Color"
            />
          </div>
        </div>
      )}

      {/* Slide Formatting Tab */}
      {activeTab === 'slide' && (
        <div className="space-y-4">
          {/* Background Color */}
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Background</label>
            <div className="grid grid-cols-5 gap-1 mb-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleSlideUpdate({ background: color })}
                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <input
              type="color"
              value={slide.background || '#FFFFFF'}
              onChange={(e) => handleSlideUpdate({ background: e.target.value })}
              className="w-full h-8 border rounded cursor-pointer"
              title="Custom Background Color"
            />
          </div>

          {/* Themes */}
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Themes</label>
            <div className="space-y-2">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleSlideUpdate({ 
                    background: theme.bg, 
                    textColor: theme.text 
                  })}
                  className="w-full p-2 text-left text-sm rounded border hover:bg-gray-50 dark:hover:bg-gray-700"
                  style={{ 
                    backgroundColor: theme.bg, 
                    color: theme.text,
                    border: `1px solid ${theme.text}20`
                  }}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Options */}
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Layout</label>
            <select 
              value={slide.layout || 'title-content'}
              onChange={(e) => handleSlideUpdate({ layout: e.target.value })}
              className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="title-content">Title & Content</option>
              <option value="title-only">Title Only</option>
              <option value="content-only">Content Only</option>
              <option value="two-column">Two Column</option>
              <option value="blank">Blank</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormatPanel;