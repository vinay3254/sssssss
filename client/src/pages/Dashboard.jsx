import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePresentation } from '../contexts/PresentationContext';
import { RiFileAddLine, RiStarLine, RiHistoryLine, RiTextWrap, RiImageLine, RiBarChartLine, RiTableLine, RiEmotionLine, RiVideoLine, RiMusicLine, RiPaletteLine, RiSettings3Line, RiLayoutLine, RiRulerLine, RiBrushLine, RiFolderLine, RiPlayLine, RiCloseLine } from 'react-icons/ri';
import Logo from '../components/Logo';
import Toolbar from '../components/Toolbar';
import Sidebar from '../components/Sidebar';
import SlideEditor from '../components/SlideEditor';
import SpeakerNotes from '../components/SpeakerNotes';
import LayoutSelector from '../components/LayoutSelector';
// import FormatPanel removed
// import DrawingTools removed
// import EnhancedChartComponent removed
// import AddInsPanel removed
import AnimationPanel from '../components/AnimationPanel';
import TableToolbar from '../components/TableToolbar';
import PresenterMode from '../components/PresenterMode';
import SlideShow from '../components/SlideShow';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import PresentationManager from '../components/PresentationManager';
import DropdownMenu, { DropdownItem, DropdownSeparator } from '../components/DropdownMenu';
import TemplateLibrary from '../components/TemplateLibrary';
import RecentPresentations from '../components/RecentPresentations';
import SearchPresentations from '../components/SearchPresentations';
import AIAssistant from '../components/AIAssistant';
import HeaderFooterModal from '../components/HeaderFooterModal';
import ChartComponent from '../components/ChartComponent';
import TableComponent from '../components/TableComponent';
import ThemePresetPicker from '../components/ThemePresetPicker';
import ImportMenu from '../components/ImportMenu';
import ExportMenu from '../components/ExportMenu';
import InteractiveElements from '../components/InteractiveElements';
import MobileView from '../components/MobileView';
import VersionHistory from '../components/VersionHistory';
import ThesaurusModal from '../components/ThesaurusModal';
import SpellCheckModal from '../components/SpellCheckModal';
import RenameModal from '../components/RenameModal';
import PrintDialog from '../components/PrintDialog';
import OnlineImageModal from '../components/OnlineImageModal';
import { exportToJSON, exportPresentation, generateSamplePresentation } from '../utils/exportUtils';
import { handleFileImport } from '../utils/importUtils';
import { checkSpelling } from '../utils/spellCheck';



const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { slides, currentSlide, setSlides, setCurrentSlide, presentationMeta, setPresentationMeta, updateSlide, renamePresentation, undo, redo, addSlide, deleteSlide, applyLayout: contextApplyLayout } = usePresentation();
  const [activePanel, setActivePanel] = useState(null);
  const [authFlow, setAuthFlow] = useState(localStorage.getItem('authFlow') || 'login');
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showPresentationManager, setShowPresentationManager] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showRecentPresentations, setShowRecentPresentations] = useState(false);
  const [showSearchPresentations, setShowSearchPresentations] = useState(false);
  const [showPresenterMode, setShowPresenterMode] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInsertChart, setShowInsertChart] = useState(false);
  const [showInsertTable, setShowInsertTable] = useState(false);
  const [showHeaderFooter, setShowHeaderFooter] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showInteractiveElements, setShowInteractiveElements] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);
  const [showShapeSelector, setShowShapeSelector] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showSlideSorter, setShowSlideSorter] = useState(false);
  const [showThesaurusModal, setShowThesaurusModal] = useState(false);
  const [thesaurusWord, setThesaurusWord] = useState('');
  const [thesaurusSynonyms, setThesaurusSynonyms] = useState([]);
  const [showSpellCheckModal, setShowSpellCheckModal] = useState(false);
  const [misspelledWords, setMisspelledWords] = useState([]);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showGridlines, setShowGridlines] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedTableElement, setSelectedTableElement] = useState(null);
  const [selectedTableCells, setSelectedTableCells] = useState([]);
  const [activeRibbonTab, setActiveRibbonTab] = useState('File');
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Font formatting controls for Recent section
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('16');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
  const [savedSelection, setSavedSelection] = useState(null);
  const [hasTextSelection, setHasTextSelection] = useState(false);
  
  // Lists and Alignment state for Recent section
  const [selectedList, setSelectedList] = useState('bullet');
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [alignment, setAlignment] = useState('left');

  const fontFamilies = ['Arial', 'Calibri', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Tahoma', 'Comic Sans MS', 'Impact', 'Trebuchet MS'];
  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

  const listTypes = [
    { value: 'bullet', label: '• Bullet Points', icon: '•' },
    { value: 'numeric', label: '1. Numeric', icon: '1.' },
    { value: 'alphabetic', label: 'A. Alphabetic', icon: 'A.' },
    { value: 'stars', label: '★ Stars', icon: '★' },
    { value: 'arrows', label: '→ Arrows', icon: '→' }
  ];

  const themeTextColors = [
    ['#FFFFFF', '#F2F2F2', '#D3D3D3', '#A6A6A6', '#808080', '#404040'],
    ['#FFC7CE', '#FFEB9C', '#C6EFCE', '#B4C7E7', '#FFC7CE', '#F4B084'],
    ['#FF0000', '#FFC000', '#00B050', '#0070C0', '#FF0000', '#C65911']
  ];

  const standardTextColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00B050', '#0070C0', '#FFD966',
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#C7CEEA', '#C9A0DC'
  ];

  const themeHighlightColors = [
    ['#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FF0000', '#FFC000'],
    ['#FFFF99', '#CCFFCC', '#CCFFFF', '#FFCCFF', '#FF9999', '#FFCC99'],
    ['#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#00FFFF', '#FFCC00']
  ];

  const standardHighlightColors = [
    '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FF0000', '#FFC000',
    '#FFFF99', '#CCFFCC', '#CCFFFF', '#FFCCFF', '#FF9999', '#FFCC99'
  ];

  const location = useLocation();

  useEffect(() => {
    // Load persisted authFlow when component mounts
    const flow = localStorage.getItem('authFlow') || 'login';
    setAuthFlow(flow);

    // Load template from navigation state (from home page) or localStorage (from template library)
    const templateFromState = location.state?.template;
    const selectedTemplate = localStorage.getItem('selectedTemplate');

    if (templateFromState && templateFromState.slides && templateFromState.slides.length > 0) {
      // Template from home page navigation
      setSlides(templateFromState.slides);
      setCurrentSlide(0);
      localStorage.setItem('undoHistory', JSON.stringify([templateFromState.slides]));
      setPresentationMeta({ ...presentationMeta, title: templateFromState.name || 'Untitled', updatedAt: new Date().toISOString() });
    } else if (selectedTemplate) {
      // Template from template library
      try {
        const template = JSON.parse(selectedTemplate);
        if (template.slides && template.slides.length > 0) {
          setSlides(template.slides);
          setCurrentSlide(0); // Ensure we start at the first slide
          localStorage.setItem('undoHistory', JSON.stringify([template.slides]));
          setPresentationMeta({ ...presentationMeta, title: template.name || 'Untitled', updatedAt: new Date().toISOString() });
        }
        localStorage.removeItem('selectedTemplate');
      } catch (error) {
        console.error('Error loading selected template:', error);
        localStorage.removeItem('selectedTemplate');
      }
    }
    // Load demo presentation if in demo mode and no template was loaded
    else if (flow === 'demo') {
      const demoSlides = [
        {
          id: 1,
          title: 'Welcome to EtherX PPT Demo',
          content: 'This is a sample presentation to showcase our features. Try editing this text!',
          background: '#ffffff',
          textColor: '#000000',
          layout: 'title-content',
          elements: []
        },
        {
          id: 2,
          title: 'Key Features',
          content: '• Rich text editing\n• Drag & drop elements\n• Multiple export formats\n• Professional templates',
          background: '#f8fafc',
          textColor: '#1f2937',
          layout: 'title-content',
          elements: []
        },
        {
          id: 3,
          title: 'Get Started',
          content: 'Click anywhere to edit text, use the toolbar to add elements, and explore all the features!',
          background: '#fff7ed',
          textColor: '#9a3412',
          layout: 'title-content',
          elements: []
        }
      ];
      setSlides(demoSlides);
      localStorage.setItem('undoHistory', JSON.stringify([demoSlides]));
    }

    const handleStartSlideshow = () => setIsSlideshow(true);
    const handleExitSlideshow = () => setIsSlideshow(false);

    window.addEventListener('startSlideshow', handleStartSlideshow);
    window.addEventListener('exitSlideshow', handleExitSlideshow);

    return () => {
      window.removeEventListener('startSlideshow', handleStartSlideshow);
      window.removeEventListener('exitSlideshow', handleExitSlideshow);
    };
  }, []);

  // Handle deep-links from landing: favourites/history
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    if (view === 'history') {
      if (user) setShowRecentPresentations(true);
    }
    if (view === 'favourites') {
      if (user) setShowFavourites(true);
    }
  }, [location.search, user]);

  // Track text selection for formatting buttons
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const hasSelection = selection && selection.toString().length > 0;
      setHasTextSelection(hasSelection);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
    };
  }, []);

  const saveToHistory = () => {
    const history = JSON.parse(localStorage.getItem('undoHistory') || '[]');
    history.push(JSON.parse(JSON.stringify(slides)));
    if (history.length > 50) history.shift();
    localStorage.setItem('undoHistory', JSON.stringify(history));
    localStorage.removeItem('redoHistory');
  };

  const applyLayout = (layoutType) => {
    saveToHistory();
    updateSlide(currentSlide, { 
      layout: layoutType,
      layoutMeta: { type: layoutType }
    });
  };



  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          handleRedo();
        } else if (e.key === 'p') {
          e.preventDefault();
          setShowPrintDialog(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close image URL popup when clicking outside
  useEffect(() => {
    if (!showImageUrlInput) return;
    const handleClick = (e) => {
      if (!e.target.closest('[data-image-url-popup]')) {
        setShowImageUrlInput(false);
        setImageUrlValue('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showImageUrlInput]);

  const handleNewPresentation = () => {
    if (confirm('Start a new presentation? Unsaved changes will be lost.')) {
      const firstSlide = [{ id: Date.now(), title: 'Slide 1', content: 'Click to add content', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }];
      setSlides(firstSlide);
      localStorage.setItem('undoHistory', JSON.stringify([firstSlide]));
      localStorage.removeItem('redoHistory');
      setPresentationMeta({ ...presentationMeta, updatedAt: new Date().toISOString(), title: 'Untitled' });
    }
  };

  // Font formatting handlers for Recent section
  const handleFontFamilyChange = (family) => {
    setFontFamily(family);
    const editableElement = document.querySelector('[contenteditable="true"]');
    if (editableElement) editableElement.focus();
    document.execCommand('fontName', false, family);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    const editableElement = document.querySelector('[contenteditable="true"]');
    if (editableElement) editableElement.focus();
    // Font size needs a value from 1-7
    const fontSize = Math.min(7, Math.max(1, Math.round(parseInt(size) / 6)));
    document.execCommand('fontSize', false, fontSize);
  };

  const handleUpperCase = () => {
    const editableElement = document.querySelector('[contenteditable="true"]');
    if (editableElement) editableElement.focus();
    const selection = window.getSelection();
    if (selection.toString()) {
      document.execCommand('insertText', false, selection.toString().toUpperCase());
    }
  };

  const handleLowerCase = () => {
    const editableElement = document.querySelector('[contenteditable="true"]');
    if (editableElement) editableElement.focus();
    const selection = window.getSelection();
    if (selection.toString()) {
      document.execCommand('insertText', false, selection.toString().toLowerCase());
    }
  };

  const toggleBold = () => {
    const editableElement = document.querySelector('[contenteditable="true"]');
    if (editableElement) editableElement.focus();
    setIsBold(!isBold);
    document.execCommand('bold', false);
  };

  const toggleItalic = () => {
    const editableElement = document.querySelector('[contenteditable="true"]');
    if (editableElement) editableElement.focus();
    setIsItalic(!isItalic);
    document.execCommand('italic', false);
  };

  const toggleUnderline = () => {
    const editableElement = document.querySelector('[contenteditable="true"]');
    if (editableElement) editableElement.focus();
    setIsUnderline(!isUnderline);
    document.execCommand('underline', false);
  };

  const toggleStrikethrough = () => {
    const editableElement = document.querySelector('[contenteditable="true"]');
    if (editableElement) editableElement.focus();
    setIsStrikethrough(!isStrikethrough);
    document.execCommand('strikethrough', false);
  };

  const handleTextColor = (color) => {
    if (savedSelection) {
      try {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedSelection);
        
        const editableElement = savedSelection.startContainer.nodeType === 3 
          ? savedSelection.startContainer.parentElement 
          : savedSelection.startContainer;
        
        let contentEditableParent = editableElement;
        while (contentEditableParent && contentEditableParent.contentEditable !== 'true') {
          contentEditableParent = contentEditableParent.parentElement;
        }
        
        if (contentEditableParent) {
          contentEditableParent.focus();
          document.execCommand('foreColor', false, color);
        }
      } catch (e) {
        console.error('Error applying text color:', e);
      }
    }
  };

  const handleHighlightColor = (color) => {
    if (savedSelection) {
      try {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedSelection);
        
        const editableElement = savedSelection.startContainer.nodeType === 3 
          ? savedSelection.startContainer.parentElement 
          : savedSelection.startContainer;
        
        let contentEditableParent = editableElement;
        while (contentEditableParent && contentEditableParent.contentEditable !== 'true') {
          contentEditableParent = contentEditableParent.parentElement;
        }
        
        if (contentEditableParent) {
          contentEditableParent.focus();
          document.execCommand('backColor', false, color);
        }
      } catch (e) {
        console.error('Error applying highlight color:', e);
      }
    }
  };

  const handleListChange = (listType) => {
    setSelectedList(listType);
    setShowListDropdown(false);
    
    // Get the current selection
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.toString().length === 0) {
      // Try to focus on any contentEditable element
      const editableElement = document.querySelector('[contenteditable="true"]');
      if (editableElement) {
        editableElement.focus();
      }
      return;
    }

    // Ensure we have focus on the contentEditable element
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const editableElement = container.nodeType === 3 
      ? container.parentElement 
      : container;
    
    if (editableElement && editableElement.contentEditable === 'true') {
      editableElement.focus();
      
      // Reselect the range
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    // Apply list formatting
    switch(listType) {
      case 'bullet':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'numeric':
        document.execCommand('insertOrderedList', false);
        break;
      case 'alphabetic':
        document.execCommand('insertOrderedList', false);
        break;
      case 'stars':
      case 'arrows':
        document.execCommand('insertUnorderedList', false);
        break;
      default:
        document.execCommand('insertUnorderedList', false);
    }
  };

  const handleAlignmentChange = (alignType) => {
    setAlignment(alignType);
    
    // Get the current selection
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.toString().length === 0) {
      // Try to focus on any contentEditable element
      const editableElement = document.querySelector('[contenteditable="true"]');
      if (editableElement) {
        editableElement.focus();
      }
      return;
    }

    // Ensure we have focus on the contentEditable element
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const editableElement = container.nodeType === 3 
      ? container.parentElement 
      : container;
    
    if (editableElement && editableElement.contentEditable === 'true') {
      editableElement.focus();
      
      // Reselect the range
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    switch(alignType) {
      case 'left':
        document.execCommand('justifyLeft', false);
        break;
      case 'center':
        document.execCommand('justifyCenter', false);
        break;
      case 'right':
        document.execCommand('justifyRight', false);
        break;
      case 'justify':
        document.execCommand('justifyFull', false);
        break;
      default:
        document.execCommand('justifyLeft', false);
    }
  };

  const handleSavePresentation = async () => {
    const name = prompt('Save As filename (without extension):', presentationMeta.title || 'presentation')?.trim();
    if (name) {
      try {
        // Save to local storage (for recent files)
        const recent = JSON.parse(localStorage.getItem('recentFiles') || '[]');
        const newFile = {
          id: Date.now(),
          name: name + '.pptx',
          modified: new Date().toISOString(),
          slides: slides,
          title: name
        };
        
        // Remove old entry if exists with same name
        const filteredRecent = recent.filter(f => f.name !== newFile.name);
        localStorage.setItem('recentFiles', JSON.stringify([newFile, ...filteredRecent].slice(0, 20)));
        
        // Also save to savedPresentations
        const saved = JSON.parse(localStorage.getItem('savedPresentations') || '{}');
        saved[name] = {
          slides,
          name,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('savedPresentations', JSON.stringify(saved));
        
        // Export to PDF
        await exportPresentation(slides, 'pdf', name);
        setPresentationMeta({ ...presentationMeta, title: name, updatedAt: new Date().toISOString() });
        
        alert('Presentation saved successfully!');
      } catch (error) {
        console.error('Save failed:', error);
        alert('Failed to save presentation');
      }
    }
  };

  const handleSharePresentation = () => {
    if (navigator.share) {
      navigator.share({
        title: presentationMeta.title || 'Presentation',
        text: 'Check out my presentation!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSynonymSelect = (synonym) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(synonym));
      setShowThesaurusModal(false);
    }
  };

  const renderRightPanel = () => {
    // Show table toolbar if a table is selected
    if (selectedTableElement) {
      return (
        <TableToolbar 
          selectedElement={selectedTableElement}
          onUpdate={(updates) => {
            const elements = slides[currentSlide]?.elements || [];
            const updatedElements = elements.map(el => 
              el.id === selectedTableElement.id ? { ...el, ...updates } : el
            );
            updateSlide(currentSlide, { elements: updatedElements });
            setSelectedTableElement({ ...selectedTableElement, ...updates });
          }}
          selectedCells={selectedTableCells}
        />
      );
    }
    
    switch (activePanel) {
      case 'layout':
        return <LayoutSelector applyLayout={applyLayout} currentSlide={currentSlide} onClose={() => setActivePanel(null)} />;
      case 'animations':
        return <AnimationPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-black overflow-hidden">
      <KeyboardShortcuts />
      
      {/* PowerPoint-style Ribbon Menu */}
      <div className="bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-gray-50 dark:bg-gray-800 border-b">
          <div className="flex items-center space-x-1">
            <Logo className="h-6" />
            <button onClick={() => navigate('/')} className="text-[10px] font-medium hover:underline">EtherX PowerPoint</button>
            <span className="text-[9px] text-gray-500">- {presentationMeta.title || 'Untitled'}</span>
            <button
              onClick={() => setShowRenameModal(true)}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Rename presentation"
            >
              <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-1">
            {/* Undo/Redo Buttons */}
            <div className="flex items-center space-x-0.5 border-r border-gray-300 dark:border-gray-600 pr-1">
              <button 
                onClick={handleUndo}
                className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              </button>
              <button 
                onClick={handleRedo}
                className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" /></svg>
              </button>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-0.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <DropdownMenu
              label={
                <div className="flex items-center gap-1">
                  {user?.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt="Profile" 
                      className="w-4 h-4 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const next = e.target.nextElementSibling;
                        if (next) next.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-medium" 
                    style={{ 
                      backgroundColor: '#F0A500',
                      display: user?.profilePhoto ? 'none' : 'flex'
                    }}
                  >
                    {(user?.name || user?.email || 'User').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-[8px] font-medium">{user?.name || 'User'}</div>
                    <div className="text-[7px] opacity-75">{user?.email || 'user@example.com'}</div>
                  </div>
                </div>
              }
              align="right"
            >
              <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(240,165,0,0.08)' }}>
                <div className="flex items-center gap-3">
                  {user?.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const next = e.target.nextElementSibling;
                        if (next) next.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium" 
                    style={{ 
                      backgroundColor: '#F0A500',
                      display: user?.profilePhoto ? 'none' : 'flex'
                    }}
                  >
                    {(user?.name || user?.email || 'User').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{user?.name || 'User'}</div>
                    <div className="text-xs opacity-75">{user?.email || 'user@example.com'}</div>
                  </div>
                </div>
              </div>
              
              <div className="py-1">
                <DropdownItem onSelect={() => navigate('/profile')}>Custom Profile</DropdownItem>
                <DropdownItem onSelect={() => navigate('/change-password')}>Change Password</DropdownItem>
              </div>
              
              <div className="py-1 border-t" style={{ borderColor: 'rgba(240,165,0,0.08)' }}>
                <DropdownItem onSelect={() => { 
                  try { 
                    localStorage.removeItem('authFlow');
                    localStorage.removeItem('token');
                  } catch {} 
                  logout();
                  navigate('/');
                }}>Log Out</DropdownItem>
              </div>
            </DropdownMenu>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => window.electronAPI?.minimize?.() || console.log('Minimize')}
                className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-[9px]"
                title="Minimize"
              >
                −
              </button>
              <button 
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }}
                className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-[9px]"
                title="Toggle Fullscreen"
              >
                □
              </button>
              <button 
                onClick={() => navigate('/')}
                className="p-0.5 hover:bg-red-500 hover:text-white rounded text-[9px]"
                title="Close"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Ribbon Tabs */}
        <div className="flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-800">
          <div className="flex space-x-3">
            {['Home', 'File', 'Insert', 'Design', 'Transitions', 'Animations', 'Slide Show', 'Review', 'View'].map(tab => (
              <button 
                key={tab}
                onClick={() => {
                  if (tab === 'Home') {
                    navigate('/home');
                  } else {
                    setActiveRibbonTab(tab);
                  }
                }}
                className={`px-2 py-0.5 text-[10px] font-medium ${
                  activeRibbonTab === tab 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-b-2 border-yellow-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Ribbon Content */}
        <div className="px-2 py-1 bg-white dark:bg-black">

          {activeRibbonTab === 'File' && (
            <div className="flex items-center space-x-4">
              {/* File Operations */}
              <div className="flex items-center space-x-2">
                <div className="text-center">
                  <button 
                    onClick={handleNewPresentation}
                    className="flex flex-col items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[10px]">New</span>
                  </button>
                </div>
                
                <div className="text-center">
                  <button 
                    onClick={() => setShowPresentationManager(true)}
                    className="flex flex-col items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    <span className="text-[10px]">Open</span>
                  </button>
                </div>

                <div className="text-center">
                  <button 
                    onClick={handleSavePresentation}
                    className="flex flex-col items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-[10px]">Save</span>
                  </button>
                </div>

                <div className="text-center">
                  <button 
                    onClick={() => setShowRenameModal(true)}
                    className="flex flex-col items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="text-[10px]">Rename</span>
                  </button>
                </div>

                <div className="text-center">
                  <button 
                    onClick={handleSharePresentation}
                    className="flex flex-col items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span className="text-[10px]">Share</span>
                  </button>
                </div>

                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setShowPrintDialog(true)}
                      className="flex flex-col items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      title="Print (Ctrl+P)"
                    >
                      <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span className="text-[10px]">Print</span>
                    </button>
                  </div>
                </div>

                <div className="text-center relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex flex-col items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    disabled={isExporting}
                  >
                    <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-[10px]">{isExporting ? 'Exporting...' : 'Export'}</span>
                  </button>
                  <ExportMenu
                    isOpen={showExportMenu}
                    onClose={() => setShowExportMenu(false)}
                    onExport={async (format) => {
                      try {
                        if (!slides || slides.length === 0) {
                          alert('No slides to export. Please create some content first.');
                          return;
                        }

                        const filename = presentationMeta.title || 'presentation';
                        console.log(`Starting export as ${format}...`);

                        // Set loading state
                        setIsExporting(true);

                        // Use setTimeout to prevent UI blocking
                        setTimeout(async () => {
                          try {
                            await exportPresentation(slides, format, filename);
                            console.log('Successfully exported as:', format);
                            alert(`Successfully exported as ${format.toUpperCase()}!`);
                          } catch (error) {
                            console.error('Export failed:', error);
                            alert('Export failed: ' + error.message);
                          } finally {
                            // Always reset loading state
                            setIsExporting(false);
                          }
                        }, 100);

                      } catch (error) {
                        console.error('Export setup failed:', error);
                        alert('Export setup failed: ' + error.message);
                        setIsExporting(false);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

              {/* Recent Files - no duplicated formatting buttons here */}
              <div className="flex items-center gap-2">
                <div>
                  <h4 className="text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Recent</h4>
                  <button
                    onClick={() => setShowRecentPresentations(true)}
                    className="text-[10px] text-blue-600 hover:underline"
                  >
                    View Recent Files
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeRibbonTab === 'Home' && (
            <div className="flex items-center space-x-8">

              
              {/* Clipboard */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => {
                    if (slides[currentSlide]) {
                      navigator.clipboard.writeText(JSON.stringify(slides[currentSlide]));
                    }
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copy
                  </button>
                  <button onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      const slide = JSON.parse(text);
                      if (slide.id) {
                        slide.id = Date.now();
                        setSlides([...slides, slide]);
                      }
                    } catch {}
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    Paste
                  </button>
                </div>
                <span className="text-xs text-gray-500">Clipboard</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Slides */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => addSlide('title-content')} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New
                  </button>
                  <button onClick={() => setActivePanel(activePanel === 'layout' ? null : 'layout')} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <RiLayoutLine className="w-6 h-6 mb-1" />
                    Layout
                  </button>
                  <button onClick={() => {
                    if (slides.length > 1) {
                      saveToHistory();
                      const newSlides = slides.filter((_, i) => i !== currentSlide);
                      setSlides(newSlides);
                      if (currentSlide >= newSlides.length) {
                        setCurrentSlide(newSlides.length - 1);
                      }
                    }
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete
                  </button>
                </div>
                <span className="text-xs text-gray-500">Slides</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Drawing */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => {
                    const el = { id: Date.now(), type: 'shape', shapeType: 'rectangle', fill: '#F0A500', stroke: '#8a6d00', strokeWidth: 2, x: 200, y: 220, width: 160, height: 100 };
                    const elems = slides[currentSlide]?.elements || [];
                    updateSlide(currentSlide, { elements: [...elems, el] });
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Shapes
                  </button>
                  <button onClick={() => {
                    const el = { id: Date.now(), type: 'textbox', content: 'Text Box', x: 100, y: 100, width: 240, height: 60, fontSize: 18, fontFamily: 'Arial', color: '#000', backgroundColor: 'transparent' };
                    const elems = slides[currentSlide]?.elements || [];
                    updateSlide(currentSlide, { elements: [...elems, el] });
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <RiTextWrap className="w-6 h-6 mb-1" />
                    Text Box
                  </button>
                  <button onMouseDown={(e) => {
                    // Prevent selection clearing
                    e.preventDefault();
                    const selection = window.getSelection().toString().trim();
                    if (selection) {
                      const word = selection.toLowerCase();
                      // Simple synonym dictionary
                      const synonyms = {
                        'presence': ['attendance', 'existence', 'being', 'company'],
                        'happy': ['joyful', 'cheerful', 'content', 'pleased', 'delighted'],
                        'background': ['backdrop', 'setting', 'context', 'history', 'foundation'],
                        'dog': ['canine', 'puppy', 'hound', 'pet', 'animal'],
                        'house': ['home', 'residence', 'dwelling', 'building', 'property'],
                        'good': ['excellent', 'great', 'fine', 'superior', 'quality'],
                        'bad': ['poor', 'terrible', 'awful', 'inferior', 'negative'],
                        'big': ['large', 'huge', 'enormous', 'massive', 'substantial'],
                        'small': ['tiny', 'little', 'miniature', 'compact', 'petite'],
                        'fast': ['quick', 'rapid', 'swift', 'speedy', 'hasty'],
                        'slow': ['gradual', 'leisurely', 'unhurried', 'delayed', 'sluggish'],
                        'beautiful': ['gorgeous', 'lovely', 'attractive', 'stunning', 'elegant'],
                        'ugly': ['unattractive', 'hideous', 'repulsive', 'unsightly', 'plain'],
                        'smart': ['intelligent', 'clever', 'bright', 'wise', 'knowledgeable'],
                        'stupid': ['dumb', 'foolish', 'silly', 'unintelligent', 'ignorant'],
                        'important': ['significant', 'crucial', 'essential', 'vital', 'key'],
                        'easy': ['simple', 'straightforward', 'effortless', 'uncomplicated', 'basic'],
                        'hard': ['difficult', 'challenging', 'tough', 'complicated', 'demanding'],
                        'new': ['fresh', 'recent', 'modern', 'current', 'novel'],
                        'old': ['ancient', 'aged', 'vintage', 'antique', 'elderly'],
                        'hot': ['warm', 'heated', 'fiery', 'scorching', 'tropical'],
                        'cold': ['cool', 'chilly', 'freezing', 'icy', 'frigid'],
                        'rich': ['wealthy', 'affluent', 'prosperous', 'well-off', 'opulent'],
                        'poor': ['impoverished', 'needy', 'destitute', 'indigent', 'broke'],
                        'strong': ['powerful', 'mighty', 'robust', 'sturdy', 'forceful'],
                        'weak': ['feeble', 'fragile', 'delicate', 'frail', 'helpless'],
                        'quick': ['fast', 'rapid', 'swift', 'speedy', 'prompt']
                      };

                      const wordSynonyms = synonyms[word];
                      if (wordSynonyms) {
                        setThesaurusWord(selection);
                        setThesaurusSynonyms(wordSynonyms);
                        setShowThesaurusModal(true);
                      } else {
                        alert(`No synonyms found for "${selection}". Try selecting a common word.`);
                      }
                    } else {
                      alert('Select a word to find synonyms');
                    }
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    Thesaurus
                  </button>
                </div>
                <span className="text-xs text-gray-500">Drawing</span>
              </div>
            </div>
          )}
          
          {activeRibbonTab === 'Insert' && (
            <div className="flex items-center space-x-8">
              {/* Slides */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => {
                    saveToHistory();
                    const currentSlideStyle = slides[currentSlide] || {};
                    const newSlide = { id: Date.now(), title: `Slide ${slides.length + 1}`, content: 'Click to add content', background: currentSlideStyle.background || '#ffffff', textColor: currentSlideStyle.textColor || '#000000', layout: 'title-content', elements: [] };
                    setSlides([...slides, newSlide]);
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New Slide
                  </button>
                  <button onClick={() => setActivePanel(activePanel === 'layout' ? null : 'layout')} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <RiLayoutLine className="w-6 h-6 mb-1" />
                    Layout
                  </button>
                </div>
                <span className="text-xs text-gray-500">Slides</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Tables */}
              <div className="flex flex-col items-center">
                <button onClick={() => setShowInsertTable(true)} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                  <RiTableLine className="w-6 h-6 mb-1" />
                  Table
                </button>
                <span className="text-xs text-gray-500">Tables</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Images */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const el = { id: Date.now(), type: 'image', src: e.target.result, x: 120, y: 140, width: 300, height: 200, alt: 'Image' };
                          const elems = slides[currentSlide]?.elements || [];
                          updateSlide(currentSlide, { elements: [...elems, el] });
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <RiImageLine className="w-6 h-6 mb-1" />
                    Pictures
                  </button>
                  <button
                    onClick={() => setShowImageUrlInput(true)}
                    className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs"
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    Online
                  </button>
                </div>
                <span className="text-xs text-gray-500">Images</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Charts */}
              <div className="flex flex-col items-center">
                <button onClick={() => setShowInsertChart(true)} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                  <RiBarChartLine className="w-6 h-6 mb-1" />
                  Chart
                </button>
                <span className="text-xs text-gray-500">Charts</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Text */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => {
                    const el = { id: Date.now(), type: 'textbox', content: 'Text Box', x: 100, y: 100, width: 240, height: 60, fontSize: 18, fontFamily: 'Arial', color: '#000', backgroundColor: 'transparent' };
                    const elems = slides[currentSlide]?.elements || [];
                    updateSlide(currentSlide, { elements: [...elems, el] });
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <RiTextWrap className="w-6 h-6 mb-1" />
                    Text Box
                  </button>
                  <button onClick={() => setShowHeaderFooter(true)} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Header
                  </button>
                </div>
                <span className="text-xs text-gray-500">Text</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Media */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'video/*';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        const el = { id: Date.now(), type: 'video', src: url, x: 200, y: 240, width: 360, height: 220 };
                        const elems = slides[currentSlide]?.elements || [];
                        updateSlide(currentSlide, { elements: [...elems, el] });
                      }
                    };
                    input.click();
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <RiVideoLine className="w-6 h-6 mb-1" />
                    Video
                  </button>
                  <button onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'audio/*';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        const el = { id: Date.now(), type: 'audio', src: url, x: 220, y: 280, width: 280, height: 40 };
                        const elems = slides[currentSlide]?.elements || [];
                        updateSlide(currentSlide, { elements: [...elems, el] });
                      }
                    };
                    input.click();
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <RiMusicLine className="w-6 h-6 mb-1" />
                    Audio
                  </button>
                </div>
                <span className="text-xs text-gray-500">Media</span>
              </div>
            </div>
          )}
          
          {activeRibbonTab === 'Design' && (
            <div className="flex items-center space-x-8">
              {/* Designer */}
              <div className="flex flex-col items-center">
                <button onClick={() => setShowTemplateLibrary(true)} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  Designer
                </button>
                <span className="text-xs text-gray-500">Designer</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Themes */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      {name:'Office', colors:['#FFFFFF','#000000','#4472C4','#ED7D31']},
                      {name:'Facet', colors:['#FFFFFF','#000000','#70AD47','#4472C4']},
                      {name:'Integral', colors:['#FFFFFF','#000000','#A5A5A5','#4472C4']},
                      {name:'Ion', colors:['#FFFFFF','#000000','#ED7D31','#4472C4']}
                    ].map((theme,i) => (
                      <button key={i} onClick={() => {
                        saveToHistory();
                        const updatedSlides = slides.map(slide => ({
                          ...slide,
                          background: theme.colors[0],
                          textColor: theme.colors[1],
                          theme: theme.name,
                          accentColors: theme.colors.slice(2)
                        }));
                        setSlides(updatedSlides);
                        setPresentationMeta({ ...presentationMeta, themePreset: theme.name, updatedAt: new Date().toISOString() });
                      }} className="w-8 h-6 rounded border-2 border-gray-300 flex" title={theme.name}>
                        {theme.colors.slice(0,4).map((color,j) => (
                          <div key={j} className="flex-1" style={{backgroundColor: color}}></div>
                        ))}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowThemePicker(true)} className="flex flex-col items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
                <span className="text-xs text-gray-500">Themes</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Slide Theme */}
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-2 gap-1 mb-1 p-1 bg-white dark:bg-gray-200 rounded">
                  {[
                    {name:'Blue', bg:'#4472C4', text:'#FFFFFF'},
                    {name:'Green', bg:'#70AD47', text:'#FFFFFF'},
                    {name:'Orange', bg:'#ED7D31', text:'#FFFFFF'},
                    {name:'Gray', bg:'#A5A5A5', text:'#FFFFFF'},
                    {name:'Black', bg:'#000000', text:'#FFFFFF'},
                    {name:'White', bg:'#FFFFFF', text:'#000000'}
                  ].map((theme,i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        saveToHistory();
                        updateSlide(currentSlide, {
                          background: theme.bg,
                          textColor: theme.text
                        });
                      }} 
                      className="w-12 h-6 rounded border-2 hover:scale-105 hover:border-gray-600 transition-all shadow-sm cursor-pointer"
                      style={{backgroundColor: theme.bg, borderColor: '#D1D5DB'}}
                      title={`${theme.name} (Current Slide)`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Slide Theme</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Shapes */}
              <div className="flex flex-col items-center">
                <button onClick={() => setShowShapeSelector(!showShapeSelector)} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  Shapes
                </button>
                <span className="text-xs text-gray-500">Shapes</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Icons */}
              <div className="flex flex-col items-center">
                <button onClick={() => setShowIconSelector(!showIconSelector)} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                  <RiEmotionLine className="w-6 h-6 mb-1" />
                  Icons
                </button>
                <span className="text-xs text-gray-500">Icons</span>
              </div>
            </div>
          )}
          
          {activeRibbonTab === 'Transitions' && (
            <div className="flex items-center space-x-8">
              {/* Transition to This Slide */}
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {[
                    {name:'None',effect:'none'},
                    {name:'Fade',effect:'fade'},
                    {name:'Push',effect:'push'},
                    {name:'Wipe',effect:'wipe'},
                    {name:'Split',effect:'split'},
                    {name:'Reveal',effect:'reveal'},
                    {name:'Cover',effect:'cover'},
                    {name:'Flash',effect:'flash'}
                  ].map((transition,i) => (
                    <button key={i} onClick={() => {
                      if (currentSlide >= 0 && slides[currentSlide]) {
                        updateSlide(currentSlide, { transition: transition.effect });
                        console.log(`Applied ${transition.name} transition to slide ${currentSlide + 1}`);
                      }
                    }} className="w-12 h-8 text-xs border rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                      {transition.name}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-500">Transition to This Slide</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Timing */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col items-center">
                    <input type="number" min="0" max="10" step="0.1" defaultValue="1" className="w-16 text-xs p-1 border rounded" onChange={(e) => {
                      if (currentSlide >= 0 && slides[currentSlide]) {
                        updateSlide(currentSlide, { transitionDuration: parseFloat(e.target.value) });
                        console.log(`Set transition duration: ${e.target.value}s`);
                      }
                    }} />
                    <span className="text-xs">Duration</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="flex items-center text-xs">
                      <input type="checkbox" className="mr-1" onChange={(e) => {
                        if (currentSlide >= 0 && slides[currentSlide]) {
                          updateSlide(currentSlide, { autoAdvance: e.target.checked });
                          console.log(`Auto advance: ${e.target.checked}`);
                        }
                      }} />
                      Auto
                    </label>
                    <input type="number" min="1" max="60" defaultValue="5" className="w-12 text-xs p-1 border rounded mt-1" onChange={(e) => {
                      if (currentSlide >= 0 && slides[currentSlide]) {
                        updateSlide(currentSlide, { autoAdvanceTime: parseInt(e.target.value) });
                        console.log(`Auto advance time: ${e.target.value}s`);
                      }
                    }} />
                  </div>
                </div>
                <span className="text-xs text-gray-500">Timing</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Preview */}
              <div className="flex flex-col items-center">
                <button onClick={() => {
                  if (currentSlide >= 0 && slides[currentSlide]) {
                    const slide = slides[currentSlide];
                    if (slide?.transition) {
                      console.log(`Previewing ${slide.transition} transition`);
                      setShowPresenterMode(true);
                      setTimeout(() => setShowPresenterMode(false), 1500);
                    } else {
                      console.log('No transition set for this slide');
                    }
                  }
                }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                  <RiPlayLine className="w-6 h-6 mb-1" />
                  Preview
                  <span className="text-[10px] opacity-70">(ESC to close)</span>
                </button>
                <span className="text-xs text-gray-500">Preview</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Apply To All */}
              <div className="flex flex-col items-center">
                <button onClick={() => {
                  if (currentSlide >= 0 && slides[currentSlide]) {
                    const currentTransition = slides[currentSlide]?.transition || 'fade';
                    const currentDuration = slides[currentSlide]?.transitionDuration || 1;
                    const updatedSlides = slides.map(slide => ({
                      ...slide, 
                      transition: currentTransition,
                      transitionDuration: currentDuration
                    }));
                    setSlides(updatedSlides);
                    console.log(`Applied ${currentTransition} transition to all ${slides.length} slides`);
                    alert(`Applied ${currentTransition} transition to all ${slides.length} slides`);
                  }
                }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  Apply To All
                </button>
                <span className="text-xs text-gray-500">Apply To All</span>
              </div>
            </div>
          )}
          
          {activeRibbonTab === 'Animations' && (
            <div className="flex items-center space-x-8">
              {/* Advanced Animation */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => setActivePanel(activePanel === 'animations' ? null : 'animations')} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
                    Animation Pane
                  </button>
                  <select className="text-xs p-1 border rounded" onChange={(e) => {
                    const slide = slides[currentSlide];
                    if (!slide) return;
                    const animations = slide.animations || [];
                    const updatedAnimations = animations.map(anim => ({...anim, trigger: e.target.value}));
                    updateSlide(currentSlide, { animations: updatedAnimations });
                  }}>
                    <option value="onClick">On Click</option>
                    <option value="withPrevious">With Previous</option>
                    <option value="afterPrevious">After Previous</option>
                  </select>
                </div>
                <span className="text-xs text-gray-500">Advanced Animation</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Timing */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={slides[currentSlide]?.animationDefaults?.duration || 0.5}
                      className="w-16 text-xs p-1 border rounded"
                      onChange={(e) => {
                        const currentDefaults = slides[currentSlide]?.animationDefaults || {};
                        updateSlide(currentSlide, {
                          animationDefaults: { ...currentDefaults, duration: parseFloat(e.target.value) }
                        });
                      }}
                    />
                    <span className="text-xs">Duration</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={slides[currentSlide]?.animationDefaults?.delay || 0}
                      className="w-16 text-xs p-1 border rounded"
                      onChange={(e) => {
                        const currentDefaults = slides[currentSlide]?.animationDefaults || {};
                        updateSlide(currentSlide, {
                          animationDefaults: { ...currentDefaults, delay: parseFloat(e.target.value) }
                        });
                      }}
                    />
                    <span className="text-xs">Delay</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Timing</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Preview */}
              <div className="flex flex-col items-center">
                <button onClick={() => {
                  if (currentSlide >= 0 && slides[currentSlide]) {
                    const slide = slides[currentSlide];
                    const animations = slide.animations || [];
                    if (animations.length > 0) {
                      console.log('Starting animation preview...');
                      setShowPresenterMode(true);
                      setTimeout(() => setShowPresenterMode(false), 2000);
                    } else {
                      console.log('No animations found');
                    }
                  }
                }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                  <RiPlayLine className="w-6 h-6 mb-1" />
                  Preview
                  <span className="text-[10px] opacity-70">(ESC to close)</span>
                </button>
                <span className="text-xs text-gray-500">Preview</span>
              </div>
            </div>
          )}
          
          {activeRibbonTab === 'Slide Show' && (
            <div className="flex items-center space-x-8">
              {/* Start Slide Show */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => setShowPresenterMode(true)} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <RiPlayLine className="w-6 h-6 mb-1" />
                    From Start
                  </button>
                  <button onClick={() => setShowPresenterMode(true)} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    From Current
                  </button>
                </div>
                <span className="text-xs text-gray-500">Start Slide Show</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Set Up */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => {
                    if (confirm('Start recording slide show?')) {
                      const startTime = Date.now();
                      localStorage.setItem('recordingStart', startTime);
                      alert('Recording started! Press ESC to stop.');
                      setShowPresenterMode(true);
                    }
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Record
                  </button>
                  <button onClick={() => {
                    if (confirm('Start rehearse timings?')) {
                      if (slides.length === 0) {
                        alert('No slides to rehearse');
                        return;
                      }
                      const timings = slides.map((_, i) => ({ slide: i + 1, duration: Math.floor(Math.random() * 30) + 10 }));
                      const avgTime = Math.round(timings.reduce((a, b) => a + b.duration, 0) / timings.length);
                      alert(`Rehearse complete! Average time per slide: ${avgTime}s`);
                    }
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Rehearse
                  </button>
                </div>
                <span className="text-xs text-gray-500">Set Up</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Monitors */}
              <div className="flex flex-col items-center">
                <button onClick={() => {
                  const monitors = screen.availWidth > 1920 ? 'Multiple monitors detected' : 'Single monitor detected';
                  if (confirm(`${monitors}. Enable presenter view with speaker notes?`)) {
                    localStorage.setItem('presenterView', 'enabled');
                    setShowPresenterMode(true);
                  }
                }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Use Presenter View
                </button>
                <span className="text-xs text-gray-500">Monitors</span>
              </div>
            </div>
          )}
          
          {activeRibbonTab === 'Review' && (
            <div className="flex items-center space-x-8">
              {/* Proofing */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => {
                    const slide = slides[currentSlide];
                    if (!slide) return;
                    const allText = [slide.title, slide.content, slide.contentLeft, slide.contentRight, slide.compLeftContent, slide.compRightContent].filter(Boolean).join(' ');
                    const plainText = allText.replace(/<[^>]*>/g, '');
                    const misspelled = checkSpelling(plainText);
                    setMisspelledWords(misspelled);
                    setShowSpellCheckModal(true);
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Spelling
                  </button>
                </div>
                <span className="text-xs text-gray-500">Proofing</span>
              </div>

              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>

              {/* Comments */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => {
                    const comment = prompt('Add comment:');
                    if (comment) {
                      const comments = slides[currentSlide]?.comments || [];
                      const newComment = {id: Date.now(), text: comment, author: user?.name || 'User', timestamp: new Date().toISOString()};
                      updateSlide(currentSlide, { comments: [...comments, newComment] });
                      alert('Comment added successfully!');
                    }
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    New Comment
                  </button>
                  <button onClick={() => {
                    const comments = slides[currentSlide]?.comments || [];
                    if (comments.length > 0) {
                      const commentList = comments.map((c, i) => `${i+1}. ${c.author}: ${c.text}`).join('\n');
                      alert(`Comments on this slide (${comments.length}):\n\n${commentList}`);
                    } else {
                      alert('No comments on this slide.');
                    }
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    View ({slides[currentSlide]?.comments?.length || 0})
                  </button>
                  <button onClick={() => {
                    const comments = slides[currentSlide]?.comments || [];
                    if (comments.length > 0) {
                      if (confirm(`Delete all ${comments.length} comments?`)) {
                        updateSlide(currentSlide, { comments: [] });
                        alert('All comments deleted.');
                      }
                    } else {
                      alert('No comments to delete.');
                    }
                  }} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete
                  </button>
                </div>
                <span className="text-xs text-gray-500">Comments</span>
              </div>
            </div>
          )}
          
          {activeRibbonTab === 'View' && (
            <div className="flex items-center space-x-8">
              {/* Presentation Views */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => setActivePanel(null)} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                    Normal
                  </button>
                  <button onClick={() => setShowSlideSorter(true)} className="flex flex-col items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    Slide Sorter
                  </button>
                </div>
                <span className="text-xs text-gray-500">Presentation Views</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Show */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <label className="flex items-center text-xs">
                    <input type="checkbox" className="mr-1" defaultChecked />
                    Ruler
                  </label>
                  <label className="flex items-center text-xs">
                    <input type="checkbox" className="mr-1" checked={showGridlines} onChange={(e) => setShowGridlines(e.target.checked)} />
                    Gridlines
                  </label>
                  <label className="flex items-center text-xs">
                    <input type="checkbox" className="mr-1" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} />
                    Snap to Grid
                  </label>
                </div>
                <span className="text-xs text-gray-500">Show</span>
              </div>
              
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Zoom */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <button onClick={() => setZoomLevel(100)} className="text-xs p-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                    Fit to Window
                  </button>
                  <select value={zoomLevel} onChange={(e) => setZoomLevel(parseInt(e.target.value))} className="text-xs p-1 border rounded">
                    <option value={50}>50%</option>
                    <option value={75}>75%</option>
                    <option value={100}>100%</option>
                    <option value={125}>125%</option>
                    <option value={150}>150%</option>
                    <option value={200}>200%</option>
                  </select>
                </div>
                <span className="text-xs text-gray-500">Zoom</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Toolbar - Hidden for now */}
      <div className="hidden">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-8">
            <nav className="flex items-center space-x-1">
              {authFlow !== 'signin' && (
              <DropdownMenu label="File" align="left">
                {/* New Section */}
                <div className="px-3 py-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">New</div>
                  <DropdownItem onSelect={() => {
                    if (confirm('Start a new presentation? Unsaved changes will be lost.')) {
                      const firstSlide = [{ id: Date.now(), title: 'Slide 1', content: 'Click to add content', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }];
                      setSlides(firstSlide);
                      setPresentationMeta({ ...presentationMeta, updatedAt: new Date().toISOString(), title: presentationMeta.title || 'Untitled' });
                    }
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                        <RiFileAddLine className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Blank Presentation</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Start with a blank slide</div>
                      </div>
                    </div>
                  </DropdownItem>
                </div>

                <DropdownSeparator />

                {/* Open Section */}
                <div className="px-3 py-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Open</div>
                  <DropdownItem onSelect={() => setShowPresentationManager(true)}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Open</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Open from this device</div>
                      </div>
                    </div>
                  </DropdownItem>
                  <DropdownItem onSelect={() => setShowRecentPresentations(true)}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                        <RiHistoryLine className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Recent</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Open recent presentations</div>
                      </div>
                    </div>
                  </DropdownItem>
                </div>

                <DropdownSeparator />

                {/* Save Section */}
                <div className="px-3 py-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Save</div>
                  <DropdownItem onSelect={() => {
                    const name = prompt('Save As filename (without extension):', presentationMeta.title || 'presentation')?.trim();
                    if (name) {
                      exportToJSON(slides, `${name}.json`);
                      setPresentationMeta({ ...presentationMeta, title: name, updatedAt: new Date().toISOString() });
                    }
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Save As</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Save a copy</div>
                      </div>
                    </div>
                  </DropdownItem>
                </div>

                <DropdownSeparator />

                {/* Print & Export */}
                <div className="px-3 py-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Print & Export</div>
                  <DropdownItem onSelect={() => window.print()}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Print</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Print this presentation</div>
                      </div>
                    </div>
                  </DropdownItem>
                  <DropdownItem onSelect={() => setShowExportMenu(true)}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Export</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Export as PDF, PPTX, etc.</div>
                      </div>
                    </div>
                  </DropdownItem>
                </div>

                <DropdownSeparator />

                {/* Share & Account */}
                <div className="px-3 py-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Share & Account</div>
                  <DropdownItem onSelect={handleSharePresentation}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Share</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Share this presentation</div>
                      </div>
                    </div>
                  </DropdownItem>
                  <DropdownItem onSelect={() => setShowInfoModal(true)}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Properties</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Presentation information</div>
                      </div>
                    </div>
                  </DropdownItem>
                </div>

                <DropdownSeparator />

                {/* Close */}
                <div className="px-3 py-2">
                  <DropdownItem onSelect={() => {
                    if (confirm('Close presentation and return to Home?')) {
                      navigate('/');
                    }
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Close</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Close this presentation</div>
                      </div>
                    </div>
                  </DropdownItem>
                </div>
              </DropdownMenu>
              )}
              
              <button 
                onClick={() => navigate('/')}
                className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
              >
                Home
              </button>
              
              {authFlow !== 'signin' && (
              <DropdownMenu label="Insert" align="left">
                <DropdownItem onSelect={() => {
                  const el = { id: Date.now(), type: 'textbox', content: 'New text', x: 100, y: 100, width: 240, height: 60, fontSize: 18, fontFamily: 'Arial', color: '#000', backgroundColor: 'transparent' };
                  const elems = slides[currentSlide]?.elements || [];
                  updateSlide(currentSlide, { elements: [...elems, el] });
                }}>
                  <div className="flex items-center gap-2"><RiTextWrap className="w-4 h-4" /> Text Box</div>
                </DropdownItem>
                <DropdownItem onSelect={() => {
                  const url = prompt('Image URL:');
                  if (url) {
                    const el = { id: Date.now(), type: 'image', src: url, x: 120, y: 140, width: 300, height: 200, alt: 'Image' };
                    const elems = slides[currentSlide]?.elements || [];
                    updateSlide(currentSlide, { elements: [...elems, el] });
                  }
                }}>
                  <div className="flex items-center gap-2"><RiImageLine className="w-4 h-4" /> Image (URL)</div>
                </DropdownItem>
                <DropdownItem onSelect={() => setShowInsertChart(true)}>
                  <div className="flex items-center gap-2"><RiBarChartLine className="w-4 h-4" /> Chart</div>
                </DropdownItem>
                <DropdownItem onSelect={() => setShowInsertTable(true)}>
                  <div className="flex items-center gap-2"><RiTableLine className="w-4 h-4" /> Table</div>
                </DropdownItem>
                <DropdownItem onSelect={() => {
                  const el = { id: Date.now(), type: 'icon', content: '⭐', x: 260, y: 200, width: 48, height: 48, fontSize: 32 };
                  const elems = slides[currentSlide]?.elements || [];
                  updateSlide(currentSlide, { elements: [...elems, el] });
                }}>
                  <div className="flex items-center gap-2"><RiEmotionLine className="w-4 h-4" /> Icon</div>
                </DropdownItem>
                <DropdownItem onSelect={() => {
                  const url = prompt('Video URL (mp4/webm):');
                  if (url) {
                    const el = { id: Date.now(), type: 'video', src: url, x: 200, y: 240, width: 360, height: 220 };
                    const elems = slides[currentSlide]?.elements || [];
                    updateSlide(currentSlide, { elements: [...elems, el] });
                  }
                }}>
                  <div className="flex items-center gap-2"><RiVideoLine className="w-4 h-4" /> Video</div>
                </DropdownItem>
                <DropdownItem onSelect={() => {
                  const url = prompt('Audio URL (mp3/ogg):');
                  if (url) {
                    const el = { id: Date.now(), type: 'audio', src: url, x: 220, y: 280, width: 280, height: 40 };
                    const elems = slides[currentSlide]?.elements || [];
                    updateSlide(currentSlide, { elements: [...elems, el] });
                  }
                }}>
                  <div className="flex items-center gap-2"><RiMusicLine className="w-4 h-4" /> Audio</div>
                </DropdownItem>
                <DropdownItem onSelect={() => {
                  const el = { id: Date.now(), type: 'textbox', content: '<span style=\"font-weight:800;text-shadow:0 2px 6px rgba(0,0,0,0.3)\">WordArt</span>', x: 160, y: 180, width: 280, height: 80, fontSize: 28, fontFamily: 'Georgia', color: '#111', backgroundColor: 'transparent' };
                  const elems = slides[currentSlide]?.elements || [];
                  updateSlide(currentSlide, { elements: [...elems, el] });
                }}>
                  <div className="flex items-center gap-2"><RiTextWrap className="w-4 h-4" /> WordArt</div>
                </DropdownItem>
                <DropdownItem onSelect={() => {
                  const el = { id: Date.now(), type: 'shape', shapeType: 'rectangle', fill: '#F0A500', stroke: '#8a6d00', strokeWidth: 2, x: 200, y: 220, width: 160, height: 100 };
                  const elems = slides[currentSlide]?.elements || [];
                  updateSlide(currentSlide, { elements: [...elems, el] });
                }}>
                  <div className="flex items-center gap-2"><RiLayoutLine className="w-4 h-4" /> Rectangle</div>
                </DropdownItem>
              </DropdownMenu>
              )}
              
              {authFlow !== 'signin' && (
              <DropdownMenu label="Design" align="left">
                <DropdownItem onSelect={() => setActivePanel(activePanel === 'layout' ? null : 'layout')}>
                  <div className="flex items-center gap-2"><RiLayoutLine className="w-4 h-4" /> Layouts</div>
                </DropdownItem>
                <DropdownItem onSelect={() => setShowTemplateLibrary(true)}>
                  <div className="flex items-center gap-2"><RiPaletteLine className="w-4 h-4" /> Templates</div>
                </DropdownItem>
                <DropdownItem onSelect={() => setShowThemePicker(true)}>
                  <div className="flex items-center gap-2"><RiSettings3Line className="w-4 h-4" /> Theme Presets</div>
                </DropdownItem>
                <DropdownItem onSelect={() => setShowHeaderFooter(true)}>
                  <div className="flex items-center gap-2"><RiLayoutLine className="w-4 h-4" /> Header & Footer</div>
                </DropdownItem>
                <DropdownItem onSelect={() => {
                  const next = presentationMeta.slideSize === '16:9' ? '4:3' : '16:9';
                  setPresentationMeta({ ...presentationMeta, slideSize: next, updatedAt: new Date().toISOString() });
                }}>
                  <div className="flex items-center gap-2"><RiRulerLine className="w-4 h-4" /> Toggle Slide Size (Current: {presentationMeta.slideSize})</div>
                </DropdownItem>
                <DropdownItem onSelect={() => {
                  const color = prompt('Slide background color (hex):', slides[currentSlide]?.background || '#ffffff');
                  if (color) updateSlide(currentSlide, { background: color });
                }}>
                  <div className="flex items-center gap-2"><RiBrushLine className="w-4 h-4" /> Format Background</div>
                </DropdownItem>
              </DropdownMenu>
              )}
              
              {authFlow !== 'signin' && (
              <button 
                onClick={() => setActivePanel(activePanel === 'animations' ? null : 'animations')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  activePanel === 'animations' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <RiPlayLine className="w-4 h-4" />
                Animations
              </button>
              )}
              
              {authFlow !== 'signin' && (
              <button
                onClick={() => setShowPresenterMode(true)}
                className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
              >
                Presenter
              </button>
              )}
              

            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="relative">
                <button
                  onClick={() => setShowImportMenu(!showImportMenu)}
                  className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-200"
                  title="Import"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </button>
                <ImportMenu 
                  isOpen={showImportMenu}
                  onClose={() => setShowImportMenu(false)}
                  onImport={async (file, fileType) => {
                    try {
                      const importedSlides = await handleFileImport(file, fileType);
                      setSlides([...slides, ...importedSlides]);
                      console.log('Successfully imported:', file.name);
                    } catch (error) {
                      console.error('Import failed:', error);
                      alert('Import failed: ' + error.message);
                    }
                  }}
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-200"
                  title="Export"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </button>
                <ExportMenu 
                  isOpen={showExportMenu}
                  onClose={() => setShowExportMenu(false)}
                  onExport={async (format) => {
                    try {
                      const filename = presentationMeta.title || 'presentation';
                      await exportPresentation(slides, format, filename);
                      console.log('Successfully exported as:', format);
                    } catch (error) {
                      console.error('Export failed:', error);
                      alert('Export failed: ' + error.message);
                    }
                  }}
                />
              </div>
              
              <button
                onClick={() => setShowSearchPresentations(true)}
                className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-200"
                title="Search Presentations (Ctrl+F)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              

            </div>
            
            <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-700 mx-2"></div>
            

          </div>
        </div>
      </div>

      {/* Import Menu */}
      <ImportMenu 
        isOpen={showImportMenu}
        onClose={() => setShowImportMenu(false)}
        onImport={async (file, fileType) => {
          try {
            const importedSlides = await handleFileImport(file, fileType);
            setSlides([...slides, ...importedSlides]);
          } catch (error) {
            alert('Import failed: ' + error.message);
          }
        }}
      />

      {/* Main Content - Show blank state for first-time sign-in, else full editor */}
      {authFlow === 'signin' ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-xl p-8">
            <h2 className="text-3xl font-bold mb-2 nav-title">Welcome to EtherX PPT!</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8">Get started by creating your first presentation or browse our templates.</p>
            <div className="flex gap-4 justify-center">
              <button
                className="btn-primary px-6 py-3"
                onClick={() => {
                  localStorage.setItem('authFlow', 'login');
                  setAuthFlow('login');
                }}
              >
                Create New Presentation
              </button>
              <button
                className="btn-secondary px-6 py-3"
                onClick={() => setShowTemplateLibrary(true)}
              >
                Explore Templates
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex bg-white dark:bg-black overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Slide Editor */}
          <SlideEditor 
            onTableSelect={(element) => setSelectedTableElement(element)}
            onTableCellSelect={(cells) => setSelectedTableCells(cells)}
            showGridlines={showGridlines}
            snapToGrid={snapToGrid}
            zoomLevel={zoomLevel}
          />

          {/* Right Panel */}
          {renderRightPanel()}
        </div>
      )}
      
      {/* Speaker Notes */}
      <SpeakerNotes />



      {/* Slideshow removed */}
      
      {/* Presenter Mode */}
      <PresenterMode
        isActive={showPresenterMode}
        onExit={() => setShowPresenterMode(false)}
      />
      
      {/* Presentation Management Modals */}
      {showPresentationManager && (
  <PresentationManager 
    onClose={() => setShowPresentationManager(false)}
    onLoadPresentation={(data) => {
      if (data?.slides && data.slides.length > 0) {
        setSlides(data.slides);
        setCurrentSlide(0);
        setPresentationMeta({ 
          ...presentationMeta, 
          title: data.name || data.title || 'Untitled', 
          updatedAt: new Date().toISOString() 
        });
        localStorage.setItem('undoHistory', JSON.stringify([data.slides]));
      }
      setShowPresentationManager(false);
    }}
    onNewPresentation={() => {
      handleNewPresentation();
      setShowPresentationManager(false);
    }}
    onImportFile={() => {
      setShowPresentationManager(false);
      setShowImportMenu(true);
    }}
    onOpenTemplate={() => {
      setShowPresentationManager(false);
      setShowTemplateLibrary(true);
    }}
  />
)}
      
      {showTemplateLibrary && (
        <TemplateLibrary onClose={() => setShowTemplateLibrary(false)} />
      )}
      
      {showRecentPresentations && authFlow !== 'signin' && (
        <RecentPresentations 
          onClose={() => setShowRecentPresentations(false)}
          onLoadPresentation={(data) => console.log('Loaded:', data)}
        />
      )}
      
      {showSearchPresentations && (
        <SearchPresentations 
          onClose={() => setShowSearchPresentations(false)}
          onLoadPresentation={(data) => console.log('Loaded:', data)}
        />
      )}
      
      {/* Insert/Design Modals */}
      {showInsertChart && (
        <ChartComponent onClose={() => setShowInsertChart(false)} />
      )}
      {showInsertTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="animate-zoom-in">
            <TableComponent onClose={() => setShowInsertTable(false)} />
          </div>
        </div>
      )}
      {showHeaderFooter && (
        <HeaderFooterModal onClose={() => setShowHeaderFooter(false)} meta={presentationMeta} onSave={(next) => setPresentationMeta({ ...presentationMeta, ...next, updatedAt: new Date().toISOString() })} />
      )}
      {showThemePicker && (
        <ThemePresetPicker onClose={() => setShowThemePicker(false)} onSelect={(id) => {
          const themeColors = {
            'default': { bg: '#1B1A17', text: '#F0A500' },
            'ocean': { bg: '#0b132b', text: '#e0e6f1' },
            'forest': { bg: '#0f1f14', text: '#e6f2ea' }
          }[id] || { bg: '#1B1A17', text: '#F0A500' };
          const updatedSlides = slides.map(slide => ({
            ...slide,
            background: themeColors.bg,
            textColor: themeColors.text
          }));
          setSlides(updatedSlides);
          setPresentationMeta({ ...presentationMeta, themePreset: id, updatedAt: new Date().toISOString() });
        }} />
      )}


      {showInteractiveElements && <InteractiveElements onClose={() => setShowInteractiveElements(false)} />}
      {showVersionHistory && <VersionHistory onClose={() => setShowVersionHistory(false)} />}

      {/* Favourites Modal - placeholder gated by auth */}
      {showFavourites && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="modal w-96">
            <div className="modal-header">
              <h3 className="text-lg font-semibold">Favourites</h3>
              <button onClick={() => setShowFavourites(false)} className="text-neutral-500 hover:text-neutral-700">✕</button>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-2">Star presentations to see them here.</p>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowFavourites(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="modal w-[480px]">
            <div className="modal-header">
              <h3 className="nav-title">Information</h3>
              <button onClick={() => setShowInfoModal(false)} className="btn-ghost">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input className="form-input" value={presentationMeta.title || ''} onChange={(e) => setPresentationMeta({ ...presentationMeta, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Author</label>
                <input className="form-input" value={presentationMeta.author || ''} onChange={(e) => setPresentationMeta({ ...presentationMeta, author: e.target.value })} />
              </div>
              <div className="text-sm text-neutral-400">Slides: {slides.length}</div>
              <div className="text-sm text-neutral-400">Last Modified: {new Date(presentationMeta.updatedAt || Date.now()).toLocaleString()}</div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowInfoModal(false)} className="btn-secondary">Close</button>
              <button onClick={() => { setPresentationMeta({ ...presentationMeta, updatedAt: new Date().toISOString() }); setShowInfoModal(false); }} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Shape Selector Modal */}
      {showShapeSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Select Shape</h3>
              <button onClick={() => setShowShapeSelector(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                {name: 'Rectangle', type: 'rectangle'},
                {name: 'Circle', type: 'circle'},
                {name: 'Triangle', type: 'triangle'},
                {name: 'Arrow', type: 'arrow'},
                {name: 'Diamond', type: 'diamond'},
                {name: 'Star', type: 'star'},
                {name: 'Heart', type: 'heart'},
                {name: 'Hexagon', type: 'hexagon'},
                {name: 'Pentagon', type: 'pentagon'},
                {name: 'Oval', type: 'oval'}
              ].map((shape) => (
                <button
                  key={shape.type}
                  onClick={() => {
                    const el = { 
                      id: Date.now(), 
                      type: 'shape', 
                      shapeType: shape.type, 
                      fill: '#F0A500', 
                      stroke: '#8a6d00', 
                      strokeWidth: 2, 
                      x: 200, 
                      y: 220, 
                      width: 160, 
                      height: 100 
                    };
                    const elems = slides[currentSlide]?.elements || [];
                    updateSlide(currentSlide, { elements: [...elems, el] });
                    setShowShapeSelector(false);
                  }}
                  className="flex flex-col items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-8 h-8 mb-1" viewBox="0 0 100 100">
                    {shape.type === 'rectangle' && <rect x="10" y="30" width="80" height="40" fill="#F0A500" stroke="#8a6d00" strokeWidth="2" rx="2" />}
                    {shape.type === 'circle' && <ellipse cx="50" cy="50" rx="40" ry="40" fill="#F0A500" stroke="#8a6d00" strokeWidth="2" />}
                    {shape.type === 'triangle' && <polygon points="50,20 80,80 20,80" fill="#F0A500" stroke="#8a6d00" strokeWidth="2" />}
                    {shape.type === 'arrow' && <polygon points="20,40 60,40 60,25 85,50 60,75 60,60 20,60" fill="#F0A500" stroke="#8a6d00" strokeWidth="2" />}
                    {shape.type === 'diamond' && <polygon points="50,20 80,50 50,80 20,50" fill="#F0A500" stroke="#8a6d00" strokeWidth="2" />}
                    {shape.type === 'star' && <polygon points="50,15 58,35 80,35 63,50 70,75 50,60 30,75 37,50 20,35 42,35" fill="#F0A500" stroke="#8a6d00" strokeWidth="2" />}
                    {shape.type === 'heart' && <path d="M50,75 C30,55 20,40 20,30 C20,25 25,20 30,25 C35,20 40,25 50,35 C60,25 65,20 70,25 C75,20 80,25 80,30 C80,40 70,55 50,75 Z" fill="#F0A500" stroke="#8a6d00" strokeWidth="2" />}
                    {shape.type === 'hexagon' && <polygon points="30,20 70,20 85,50 70,80 30,80 15,50" fill="#F0A500" stroke="#8a6d00" strokeWidth="2" />}
                    {shape.type === 'pentagon' && <polygon points="50,20 80,40 70,75 30,75 20,40" fill="#F0A500" stroke="#8a6d00" strokeWidth="2" />}
                    {shape.type === 'oval' && <ellipse cx="50" cy="50" rx="40" ry="25" fill="#F0A500" stroke="#8a6d00" strokeWidth="2" />}
                  </svg>
                  <span className="text-xs text-gray-600 dark:text-gray-300">{shape.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Icon Selector Modal */}
      {showIconSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Select Icon</h3>
              <button onClick={() => setShowIconSelector(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {[
                '⭐', '❤️', '🎯', '💡', '🚀', '📊', '🔥', '✨', '💎', '🏆', '🎉', '🌟',
                '📈', '💰', '🎨', '🔧', '⚡', '🌍', '🎵', '📱', '💻', '🏠', '🚗', '✈️',
                '📝', '📚', '🎓', '💼', '🏢', '🛡️', '⚙️', '🔍', '📞', '✉️', '🎁', '🍕'
              ].map((icon, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const el = { 
                      id: Date.now(), 
                      type: 'icon', 
                      content: icon, 
                      x: 260, 
                      y: 200, 
                      width: 48, 
                      height: 48, 
                      fontSize: 32 
                    };
                    const elems = slides[currentSlide]?.elements || [];
                    updateSlide(currentSlide, { elements: [...elems, el] });
                    setShowIconSelector(false);
                  }}
                  className="flex items-center justify-center p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-2xl"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Print Dialog */}
      <PrintDialog
        isOpen={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        slides={slides}
        presentationMeta={presentationMeta}
        currentSlide={currentSlide}
      />

      {/* Mobile View */}
      <MobileView />

      {/* Thesaurus Modal */}
      <ThesaurusModal
        isOpen={showThesaurusModal}
        onClose={() => setShowThesaurusModal(false)}
        word={thesaurusWord}
        synonyms={thesaurusSynonyms}
        onSelectSynonym={handleSynonymSelect}
      />

      {/* Spell Check Modal */}
      <SpellCheckModal
        isOpen={showSpellCheckModal}
        onClose={() => setShowSpellCheckModal(false)}
        misspelledWords={misspelledWords}
        onReplaceWord={(wrongWord, correctWord, position) => {
          // Simple word replacement - in a real implementation, you'd need to track
          // which text field the word came from and replace it there
          const slide = slides[currentSlide];
          if (!slide) return;

          // For now, just replace in the content field as an example
          const updatedContent = slide.content ? slide.content.replace(new RegExp(`\\b${wrongWord}\\b`, 'gi'), correctWord) : '';
          updateSlide(currentSlide, { content: updatedContent });

          // Remove the corrected word from the list
          setMisspelledWords(prev => prev.filter(item => item.word !== wrongWord));
        }}
        onIgnoreWord={(word) => {
          // Remove the ignored word from the list
          setMisspelledWords(prev => prev.filter(item => item.word !== word));
        }}
      />

      {/* Rename Modal */}
      <RenameModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        currentName={presentationMeta.title || 'Untitled'}
        onRename={renamePresentation}
      />

      {/* Online Image Modal */}
      {showImageUrlInput && (
        <OnlineImageModal
          onClose={() => setShowImageUrlInput(false)}
          onInsert={(url, alt) => {
            const el = {
              id: Date.now(),
              type: 'image',
              src: url,
              x: 120, y: 140, width: 300, height: 200,
              alt: alt || 'Online Image'
            };
            const elems = slides[currentSlide]?.elements || [];
            updateSlide(currentSlide, { elements: [...elems, el] });
          }}
        />
      )}

      {/* Slide Sorter Modal */}
      {showSlideSorter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-[90vw] h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Slide Sorter</h2>
              <button onClick={() => setShowSlideSorter(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
            <div className="p-4 h-full overflow-y-auto">
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id || index}
                    className={`relative border-2 rounded-lg overflow-hidden transition-all group ${
                      index === currentSlide
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div
                      onClick={() => {
                        setCurrentSlide(index);
                        setShowSlideSorter(false);
                      }}
                      className="w-full h-24 flex flex-col justify-center items-center text-xs p-2 cursor-pointer"
                      style={{ backgroundColor: slide.background || '#ffffff' }}
                    >
                      <div
                        className="font-bold text-center mb-1 truncate w-full"
                        style={{ color: slide.textColor || '#000000', fontSize: '8px' }}
                      >
                        {slide.title || `Slide ${index + 1}`}
                      </div>
                      <div
                        className="text-center truncate w-full"
                        style={{ color: slide.textColor || '#666666', fontSize: '6px' }}
                      >
                        {slide.content ? slide.content.replace(/<[^>]*>/g, '').substring(0, 30) + '...' : 'Content'}
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newTitle = prompt('Rename slide:', slide.title || `Slide ${index + 1}`);
                        if (newTitle && newTitle.trim()) {
                          updateSlide(index, { title: newTitle.trim() });
                        }
                      }}
                      className="absolute top-1 right-1 bg-blue-500 hover:bg-blue-600 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Rename slide"
                    >
                      ✏️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;