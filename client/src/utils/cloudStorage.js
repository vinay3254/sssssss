// Simple local storage utilities for presentations

export const saveToLocal = (presentationData, filename) => {
  try {
    const saved = JSON.parse(localStorage.getItem('savedPresentations') || '{}');
    saved[filename] = {
      ...presentationData,
      filename,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('savedPresentations', JSON.stringify(saved));
    return true;
  } catch (error) {
    console.error('Failed to save presentation:', error);
    throw error;
  }
};

export const loadFromLocal = (filename) => {
  try {
    const saved = JSON.parse(localStorage.getItem('savedPresentations') || '{}');
    return saved[filename] || null;
  } catch (error) {
    console.error('Failed to load presentation:', error);
    throw error;
  }
};

export const listLocalPresentations = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('savedPresentations') || '{}');
    return Object.values(saved).map(p => ({
      filename: p.filename,
      timestamp: p.timestamp,
      folder: p.folder || 'Personal',
      slideCount: p.slides?.length || 0
    }));
  } catch (error) {
    console.error('Failed to list presentations:', error);
    return [];
  }
};

export const deleteFromLocal = (filename) => {
  try {
    const saved = JSON.parse(localStorage.getItem('savedPresentations') || '{}');
    delete saved[filename];
    localStorage.setItem('savedPresentations', JSON.stringify(saved));
    return true;
  } catch (error) {
    console.error('Failed to delete presentation:', error);
    throw error;
  }
};