import React, { useEffect } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const KeyboardShortcuts = () => {
  const { addSlide, undo, redo } = usePresentation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'n':
            if (e.shiftKey) {
              e.preventDefault();
              addSlide();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addSlide, undo, redo]);

  return null;
};

export default KeyboardShortcuts;