import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { usePresentation } from '../contexts/PresentationContext';
import { saveToLocal, loadFromLocal, listLocalPresentations } from '../utils/cloudStorage';

const PresentationManager = ({ onClose, onLoadPresentation }) => {
  const { slides, setSlides, setPresentationMeta, presentationMeta } = usePresentation();
  const [presentations, setPresentations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState(['Personal', 'Work', 'Templates']);

  useEffect(() => { loadPresentations(); }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showNewFolder) setShowNewFolder(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNewFolder, onClose]);

  const loadPresentations = () => {
    try {
      const local = listLocalPresentations();
      setPresentations(local.map(p => ({ ...p, folder: p.folder || 'Personal' })));
    } catch { setPresentations([]); }
  };

  const handleSavePresentation = () => {
    const name = prompt('Enter presentation name:');
    if (name) {
      try {
        saveToLocal({ name, slides, folder: selectedFolder === 'all' ? 'Personal' : selectedFolder, modified: new Date().toISOString() }, name);
        loadPresentations();
        alert('Saved!');
      } catch (e) { alert('Failed: ' + e.message); }
    }
  };

  const handleLoadPresentation = (filename) => {
    try {
      const data = loadFromLocal(filename);
      if (data?.slides) { setSlides(data.slides); onLoadPresentation?.(data); onClose(); }
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const handleDeletePresentation = (filename) => {
    if (confirm('Delete this presentation?')) {
      try {
        const saved = JSON.parse(localStorage.getItem('savedPresentations') || '{}');
        delete saved[filename];
        localStorage.setItem('savedPresentations', JSON.stringify(saved));
        loadPresentations();
      } catch (e) { alert('Failed: ' + e.message); }
    }
  };

  const handleDuplicatePresentation = (filename) => {
    try {
      const data = loadFromLocal(filename);
      if (data) { saveToLocal(data, `${filename} - Copy`); loadPresentations(); }
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const handleNewPresentation = () => {
    if (confirm('Start new presentation? Unsaved changes will be lost.')) {
      const firstSlide = [{ id: Date.now(), title: 'Slide 1', content: 'Click to add content', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }];
      setSlides(firstSlide);
      localStorage.setItem('undoHistory', JSON.stringify([firstSlide]));
      localStorage.removeItem('redoHistory');
      setPresentationMeta?.({ ...presentationMeta, title: 'Untitled', updatedAt: new Date().toISOString() });
      onClose();
    }
  };

  const templateSlideData = {
    'Business Pitch': [
      { id: 1, title: 'Company Name', content: 'Your tagline here', background: '#1a1a2e', textColor: '#e0e0e0', layout: 'title-content', elements: [] },
      { id: 2, title: 'The Problem', content: 'Describe the problem', background: '#16213e', textColor: '#e0e0e0', layout: 'title-content', elements: [] },
      { id: 3, title: 'Our Solution', content: 'How you solve it', background: '#0f3460', textColor: '#e0e0e0', layout: 'title-content', elements: [] },
      { id: 4, title: 'Market Opportunity', content: 'TAM, SAM, SOM', background: '#16213e', textColor: '#e0e0e0', layout: 'title-content', elements: [] },
      { id: 5, title: 'Business Model', content: 'How you make money', background: '#1a1a2e', textColor: '#e0e0e0', layout: 'title-content', elements: [] },
      { id: 6, title: 'Traction', content: 'Key metrics', background: '#0f3460', textColor: '#e0e0e0', layout: 'title-content', elements: [] },
      { id: 7, title: 'Team', content: 'Founders and key members', background: '#16213e', textColor: '#e0e0e0', layout: 'title-content', elements: [] },
      { id: 8, title: 'The Ask', content: 'Funding amount', background: '#1a1a2e', textColor: '#e0e0e0', layout: 'title-content', elements: [] },
    ],
    'Project Report': [
      { id: 1, title: 'Project Title', content: 'Overview and objectives', background: '#ffffff', textColor: '#1f2937', layout: 'title-content', elements: [] },
      { id: 2, title: 'Executive Summary', content: 'Key findings', background: '#f8fafc', textColor: '#1f2937', layout: 'title-content', elements: [] },
      { id: 3, title: 'Methodology', content: 'Approach used', background: '#ffffff', textColor: '#1f2937', layout: 'title-content', elements: [] },
      { id: 4, title: 'Findings', content: 'Key discoveries', background: '#f8fafc', textColor: '#1f2937', layout: 'title-content', elements: [] },
      { id: 5, title: 'Recommendations', content: 'Actionable next steps', background: '#ffffff', textColor: '#1f2937', layout: 'title-content', elements: [] },
      { id: 6, title: 'Conclusion', content: 'Summary and call to action', background: '#f8fafc', textColor: '#1f2937', layout: 'title-content', elements: [] },
    ],
    'Educational': [
      { id: 1, title: 'Course Title', content: 'Instructor • Date', background: '#1e3a5f', textColor: '#ffffff', layout: 'title-content', elements: [] },
      { id: 2, title: 'Learning Objectives', content: 'Students will be able to...', background: '#ffffff', textColor: '#1e3a5f', layout: 'title-content', elements: [] },
      { id: 3, title: 'Key Concept 1', content: 'Explanation', background: '#e8f4fd', textColor: '#1e3a5f', layout: 'title-content', elements: [] },
      { id: 4, title: 'Key Concept 2', content: 'Explanation', background: '#ffffff', textColor: '#1e3a5f', layout: 'title-content', elements: [] },
      { id: 5, title: 'Summary', content: 'What we covered', background: '#1e3a5f', textColor: '#ffffff', layout: 'title-content', elements: [] },
      { id: 6, title: 'Q&A', content: 'Questions and discussion', background: '#e8f4fd', textColor: '#1e3a5f', layout: 'title-content', elements: [] },
    ],
    'Marketing': [
      { id: 1, title: 'Campaign Name', content: 'Brand • Year', background: '#ff6b6b', textColor: '#ffffff', layout: 'title-content', elements: [] },
      { id: 2, title: 'Target Audience', content: 'Demographics and behaviors', background: '#ffffff', textColor: '#2d2d2d', layout: 'title-content', elements: [] },
      { id: 3, title: 'Key Message', content: 'What we want people to remember', background: '#ff6b6b', textColor: '#ffffff', layout: 'title-content', elements: [] },
      { id: 4, title: 'Channels', content: '• Social\n• Email\n• Paid ads', background: '#fff9f0', textColor: '#2d2d2d', layout: 'title-content', elements: [] },
      { id: 5, title: 'KPIs', content: 'How we measure success', background: '#ffffff', textColor: '#2d2d2d', layout: 'title-content', elements: [] },
      { id: 6, title: 'Next Steps', content: 'Timeline and approvals', background: '#ff6b6b', textColor: '#ffffff', layout: 'title-content', elements: [] },
    ],
  };

  const handleLoadTemplate = (templateName) => {
    const templateSlides = templateSlideData[templateName];
    if (!templateSlides) return;
    if (confirm(`Load "${templateName}"? This replaces current slides.`)) {
      const slidesWithIds = templateSlides.map(s => ({ ...s, id: Date.now() + Math.random() }));
      setSlides(slidesWithIds);
      localStorage.setItem('undoHistory', JSON.stringify([slidesWithIds]));
      localStorage.removeItem('redoHistory');
      setPresentationMeta?.({ ...presentationMeta, title: templateName, updatedAt: new Date().toISOString() });
      onClose();
    }
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      setFolders([...folders, newFolderName.trim()]);
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  const filteredPresentations = presentations.filter(p => {
    const matchesSearch = p.filename?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || p.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const templates = [
    { name: 'Business Pitch', slides: 8, icon: '💼' },
    { name: 'Project Report', slides: 6, icon: '📊' },
    { name: 'Educational', slides: 6, icon: '🎓' },
    { name: 'Marketing', slides: 6, icon: '📈' },
  ];

  // ── The close button is rendered via a React Portal directly into document.body
  // ── This means it lives OUTSIDE the modal DOM tree entirely, so nothing inside
  // ── the modal can ever overlap or block it.
  const closeButton = ReactDOM.createPortal(
    <button
      onClick={onClose}
      title="Close"
      style={{
        position: 'fixed',
        top: '10vh',
        right: 'calc(10% + 12px)',
        zIndex: 99999,
        width: 36,
        height: 36,
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(30,30,30,0.95)',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      ✕
    </button>,
    document.body
  );

  return ReactDOM.createPortal(
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Close button rendered into body — untouchable by modal CSS */}
      {closeButton}

      <div
        style={{ position: 'relative', width: '80%', maxWidth: 1100, height: '80%', display: 'flex', flexDirection: 'column', zIndex: 9001, borderRadius: 10, overflow: 'hidden' }}
        className="panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: 16, borderBottom: '1px solid rgba(240,165,0,0.08)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'inherit' }}>Presentation Manager</h2>
            {/* Spacer where the old button used to be — the real button is portaled above */}
            <div style={{ width: 36 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="text"
                placeholder="Search presentations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
              <select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)} className="form-select">
                <option value="all">All Folders</option>
                {folders.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowNewFolder(true)} className="btn-secondary px-3 py-2">📁 New Folder</button>
              <button onClick={handleSavePresentation} className="btn-primary px-3 py-2">💾 Save Current</button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar */}
          <div className="sidebar" style={{ width: 256, flexShrink: 0, padding: 16, overflowY: 'auto' }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#d1d5db', marginBottom: 8 }}>Quick Actions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={handleNewPresentation} className="w-full text-left px-3 py-2 text-sm btn-secondary">📄 New Presentation</button>
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file'; input.accept = '.json,.pptx,.ppt';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        try {
                          if (file.name.endsWith('.json')) {
                            const data = JSON.parse(ev.target.result);
                            if (data.slides) { setSlides(data.slides); onLoadPresentation?.(data); onClose(); }
                          } else { alert('PowerPoint import coming soon!'); }
                        } catch (err) { alert('Import failed: ' + err.message); }
                      };
                      reader.readAsText(file);
                    };
                    input.click();
                  }}
                  className="w-full text-left px-3 py-2 text-sm btn-secondary"
                >📂 Import File</button>
              </div>
            </div>

            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#d1d5db', marginBottom: 8 }}>Templates</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {templates.map(t => (
                  <button key={t.name} onClick={() => handleLoadTemplate(t.name)} className="w-full text-left px-3 py-2 text-sm btn-secondary">
                    <span>{t.icon} </span>
                    <span style={{ fontWeight: 500 }}>{t.name}</span>
                    <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 4 }}>{t.slides} slides</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPresentations.map(p => (
                <div key={p.filename} className="panel p-4 hover:glow transition-shadow">
                  <div style={{ width: '100%', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, fontSize: 40 }}>📊</div>
                  <h4 style={{ fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>{p.filename}</h4>
                  <p style={{ fontSize: 11, color: '#9ca3af' }}>Modified: {new Date(p.timestamp).toLocaleDateString()}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af' }}>Folder: {p.folder}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #374151' }}>
                    <button onClick={() => handleLoadPresentation(p.filename)} className="btn-primary px-2 py-1 text-xs">Open</button>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => handleDuplicatePresentation(p.filename)} title="Duplicate" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>📋</button>
                      <button onClick={() => handleDeletePresentation(p.filename)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPresentations.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
                  <p style={{ color: '#6b7280' }}>{searchTerm ? 'No presentations match your search.' : 'No presentations found.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Folder sub-modal */}
        {showNewFolder && (
          <div
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: 10 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowNewFolder(false); }}
          >
            <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 10, padding: 24, width: 320 }}>
              <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: 16 }}>Create New Folder</h3>
              <input
                autoFocus
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                style={{ width: '100%', padding: '8px 12px', background: '#374151', border: '1px solid #4b5563', borderRadius: 6, color: '#fff', marginBottom: 16, boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button onClick={() => setShowNewFolder(false)} style={{ padding: '8px 16px', background: '#4b5563', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                <button onClick={createFolder} style={{ padding: '8px 16px', background: '#F0A500', color: '#000', fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer' }}>Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PresentationManager;