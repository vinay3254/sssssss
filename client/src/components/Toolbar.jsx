import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';
import { saveToLocal } from '../utils/cloudStorage';
import PresentationManager from './PresentationManager';
import { RiFolderLine, RiLayoutLine, RiPlayLine } from 'react-icons/ri';

const Toolbar = ({ activePanel, setActivePanel }) => {
  const { slides, addSlide, undo, redo } = usePresentation();
  const [showPresentationManager, setShowPresentationManager] = useState(false);

  // export menu removed per simplification

  const ToolbarButton = ({ onClick, active, children, title }) => {
    return (
      <button
        onClick={onClick}
        className={`toolbar-btn ${active ? 'active' : ''}`}
        title={title}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="toolbar">
      <div className="flex items-center gap-1 flex-wrap">
        {/* File Operations */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => setShowPresentationManager(true)}
            title="Manage Presentations"
          >
            <RiFolderLine className="w-4 h-4" />
            Manage
          </ToolbarButton>
          <ToolbarButton
            onClick={() => addSlide()}
            title="New Slide (Ctrl+Shift+N)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Slide
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              try {
                const name = prompt('Enter presentation name:') || `presentation-${Date.now()}`;
                saveToLocal({ slides, name, created: new Date().toISOString() }, name);
                alert('Presentation saved locally!');
              } catch (error) {
                alert('Save failed: ' + error.message);
              }
            }}
            title="Quick Save (Ctrl+S)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Save
          </ToolbarButton>
        </div>

        {/* Edit Operations */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={undo}
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Undo
          </ToolbarButton>
          
          <ToolbarButton
            onClick={redo}
            title="Redo (Ctrl+Y)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
            Redo
          </ToolbarButton>
        </div>

        {/* Panel Toggles - keep only layout */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => setActivePanel(activePanel === 'layout' ? null : 'layout')}
            active={activePanel === 'layout'}
            title="Layout Panel"
          >
            <RiLayoutLine className="w-4 h-4" />
            Layout
          </ToolbarButton>
        </div>

        {/* Import/Export group removed per simplification */}


      </div>
      
      {/* Modals */}
      {showPresentationManager && (
        <PresentationManager 
          onClose={() => setShowPresentationManager(false)}
          onLoadPresentation={(data) => console.log('Loaded:', data)}
        />
      )}
    </div>
  );
};

export default Toolbar;