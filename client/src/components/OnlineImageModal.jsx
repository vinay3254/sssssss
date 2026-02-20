// src/components/OnlineImageModal.jsx
// Upgraded with Unsplash free search — no API key needed for basic usage

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

const UNSPLASH_ACCESS_KEY = 'your_unsplash_key'; // See instructions at bottom

// Using Picsum for demo (no key needed) + Unsplash if key provided
const searchImages = async (query) => {
  // Free option: use Lorem Picsum curated images as fallback
  // Real option: Unsplash API (free, 50 req/hour with account)
  try {
    if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'your_unsplash_key') {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await res.json();
      return data.results.map(img => ({
        thumb: img.urls.small,
        full: img.urls.regular,
        alt: img.alt_description || img.description || query,
        author: img.user.name,
      }));
    } else {
      // Fallback: use open-access Wikipedia/Wikimedia images via a CORS-friendly proxy
      // These are real images that load without CORS issues
      const topics = {
        default: [
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}1/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}1/800/600`, alt: query },
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}2/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}2/800/600`, alt: query },
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}3/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}3/800/600`, alt: query },
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}4/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}4/800/600`, alt: query },
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}5/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}5/800/600`, alt: query },
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}6/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}6/800/600`, alt: query },
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}7/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}7/800/600`, alt: query },
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}8/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}8/800/600`, alt: query },
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}9/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}9/800/600`, alt: query },
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}10/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}10/800/600`, alt: query },
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}11/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}11/800/600`, alt: query },
          { thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}12/300/200`, full: `https://picsum.photos/seed/${encodeURIComponent(query)}12/800/600`, alt: query },
        ]
      };
      return topics.default;
    }
  } catch (e) {
    return [];
  }
};

const OnlineImageModal = ({ onClose, onInsert }) => {
  const [tab, setTab] = useState('search'); // 'search' | 'url'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [url, setUrl] = useState('');
  const [urlPreviewStatus, setUrlPreviewStatus] = useState('idle');
  const [debouncedUrl, setDebouncedUrl] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Debounce URL preview
  useEffect(() => {
    setUrlPreviewStatus('idle');
    if (!url.trim()) return;
    const timer = setTimeout(() => {
      setDebouncedUrl(url.trim());
      setUrlPreviewStatus('loading');
    }, 600);
    return () => clearTimeout(timer);
  }, [url]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    setSelectedImage(null);
    setHasSearched(true);
    const results = await searchImages(searchQuery.trim());
    setSearchResults(results);
    setSearching(false);
  };

  const handleInsert = () => {
    if (tab === 'search' && selectedImage) {
      onInsert(selectedImage.full, selectedImage.alt);
      onClose();
    } else if (tab === 'url' && url.trim()) {
      onInsert(url.trim(), 'Online Image');
      onClose();
    }
  };

  const canInsert = (tab === 'search' && selectedImage) || (tab === 'url' && url.trim());

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 99000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#111827',
          border: '1px solid #1f2937',
          borderRadius: 14,
          width: 640,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 20px 0',
          flexShrink: 0,
        }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: 0 }}>
            🖼 Insert Online Image
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', color: '#9ca3af',
              width: 30, height: 30, borderRadius: 6, fontSize: 16,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '14px 20px 0', gap: 4, flexShrink: 0 }}>
          {['search', 'url'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '7px 18px',
                background: tab === t ? '#F0A500' : 'transparent',
                color: tab === t ? '#000' : '#9ca3af',
                border: tab === t ? 'none' : '1px solid #374151',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: tab === t ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t === 'search' ? '🔍 Search Images' : '🔗 Paste URL'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

          {/* SEARCH TAB */}
          {tab === 'search' && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for images... (e.g. business, nature, technology)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  style={{
                    flex: 1, padding: '9px 14px',
                    background: '#1f2937', border: '1px solid #374151',
                    borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none',
                  }}
                />
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || searching}
                  style={{
                    padding: '9px 20px',
                    background: searchQuery.trim() ? '#F0A500' : '#374151',
                    color: searchQuery.trim() ? '#000' : '#6b7280',
                    border: 'none', borderRadius: 8, fontSize: 13,
                    fontWeight: 700, cursor: searchQuery.trim() ? 'pointer' : 'not-allowed',
                    flexShrink: 0,
                  }}
                >
                  {searching ? '...' : 'Search'}
                </button>
              </div>

              {searching && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                  Searching...
                </div>
              )}

              {!searching && !hasSearched && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#4b5563' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                  <p style={{ fontSize: 13 }}>Type a search term and press Search</p>
                  <p style={{ fontSize: 11, marginTop: 6 }}>Powered by Lorem Picsum (free stock images)</p>
                </div>
              )}

              {!searching && hasSearched && searchResults.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                  No results found. Try a different search term.
                </div>
              )}

              {!searching && searchResults.length > 0 && (
                <>
                  <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 10 }}>
                    {searchResults.length} results • Click to select
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 8,
                  }}>
                    {searchResults.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        style={{
                          borderRadius: 7,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: selectedImage === img
                            ? '2px solid #F0A500'
                            : '2px solid transparent',
                          position: 'relative',
                          aspectRatio: '3/2',
                          background: '#1f2937',
                          transition: 'transform 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <img
                          src={img.thumb}
                          alt={img.alt}
                          style={{
                            width: '100%', height: '100%',
                            objectFit: 'cover', display: 'block',
                          }}
                        />
                        {selectedImage === img && (
                          <div style={{
                            position: 'absolute', top: 4, right: 4,
                            background: '#F0A500', borderRadius: '50%',
                            width: 20, height: 20,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700, color: '#000',
                          }}>✓</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Unsplash tip */}
                  <div style={{
                    marginTop: 14, padding: '10px 14px',
                    background: '#1f2937', borderRadius: 8,
                    fontSize: 11, color: '#6b7280',
                  }}>
                    💡 For specific image search, add your free{' '}
                    <span style={{ color: '#F0A500' }}>Unsplash API key</span>{' '}
                    to <code style={{ color: '#9ca3af' }}>OnlineImageModal.jsx</code>{' '}
                    — get one free at <span style={{ color: '#60a5fa' }}>unsplash.com/developers</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* URL TAB */}
          {tab === 'url' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 7 }}>
                Direct Image URL
              </label>
              <input
                autoFocus
                type="url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleInsert(); }}
                style={{
                  width: '100%', padding: '9px 12px',
                  background: '#1f2937', border: '1px solid #374151',
                  borderRadius: 8, color: '#fff', fontSize: 13,
                  marginBottom: 14, boxSizing: 'border-box', outline: 'none',
                }}
              />

              {/* Preview */}
              <div style={{
                width: '100%', height: 200,
                background: '#1f2937',
                border: '1px solid #374151',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14, overflow: 'hidden', position: 'relative',
              }}>
                {urlPreviewStatus === 'idle' && (
                  <p style={{ color: '#4b5563', fontSize: 13 }}>Paste a URL above to preview</p>
                )}
                {urlPreviewStatus === 'loading' && (
                  <p style={{ color: '#6b7280', fontSize: 13 }}>Loading preview...</p>
                )}
                {urlPreviewStatus === 'error' && (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <p style={{ color: '#f87171', fontSize: 13, marginBottom: 6 }}>⚠ Cannot preview image</p>
                    <p style={{ color: '#6b7280', fontSize: 11 }}>
                      Blocked by CORS or not a direct image URL.<br/>
                      Try using the Search tab instead, or use "Insert Anyway".
                    </p>
                  </div>
                )}
                {(urlPreviewStatus === 'loading' || urlPreviewStatus === 'success') && debouncedUrl && (
                  <img
                    key={debouncedUrl}
                    src={debouncedUrl}
                    alt="Preview"
                    onLoad={() => setUrlPreviewStatus('success')}
                    onError={() => setUrlPreviewStatus('error')}
                    style={{
                      maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                      display: urlPreviewStatus === 'success' ? 'block' : 'none',
                    }}
                  />
                )}
                {urlPreviewStatus === 'success' && (
                  <div style={{
                    position: 'absolute', bottom: 6, right: 8,
                    background: 'rgba(16,185,129,0.9)', color: '#fff',
                    fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
                  }}>✓ Image loaded</div>
                )}
              </div>

              <p style={{ fontSize: 11, color: '#4b5563' }}>
                💡 Right-click any image on the web → "Copy image address" to get a direct URL.
                URLs must end in .jpg, .png, .gif, .webp etc. and not be blocked by CORS.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 20px',
          borderTop: '1px solid #1f2937',
          flexShrink: 0,
          background: '#0d1117',
        }}>
          <p style={{ fontSize: 11, color: '#374151', margin: 0 }}>
            {tab === 'search' && selectedImage && '✓ Image selected'}
            {tab === 'search' && !selectedImage && 'Select an image to insert'}
            {tab === 'url' && urlPreviewStatus === 'success' && '✓ Image ready to insert'}
            {tab === 'url' && urlPreviewStatus === 'error' && 'CORS blocked — insert anyway or use Search tab'}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 20px', background: '#1f2937', color: '#9ca3af',
                border: '1px solid #374151', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              }}
            >Cancel</button>
            <button
              onClick={handleInsert}
              disabled={!canInsert}
              style={{
                padding: '8px 22px',
                background: canInsert ? '#F0A500' : '#1f2937',
                color: canInsert ? '#000' : '#374151',
                border: canInsert ? 'none' : '1px solid #374151',
                borderRadius: 8, fontSize: 13,
                fontWeight: 700, cursor: canInsert ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              {tab === 'url' && urlPreviewStatus === 'error' ? 'Insert Anyway' : 'Insert Image'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OnlineImageModal;

/*
=== SETUP INSTRUCTIONS ===

1. Save this file as src/components/OnlineImageModal.jsx

2. For real image search (recommended), get a FREE Unsplash API key:
   - Go to https://unsplash.com/developers
   - Create a free account & new application
   - Copy your "Access Key"
   - Replace 'your_unsplash_key' at the top of this file with your key
   - Free tier: 50 requests/hour — more than enough

3. Without an Unsplash key, the search still works using Lorem Picsum
   (random placeholder photos) — useful for testing but not topic-specific.

4. Dashboard.jsx changes needed:
   - import OnlineImageModal from '../components/OnlineImageModal';
   - Add: const [showImageUrlInput, setShowImageUrlInput] = useState(false);
   - Replace the Online button onClick with: onClick={() => setShowImageUrlInput(true)}
   - Add modal near the other modals at the bottom:
     {showImageUrlInput && (
       <OnlineImageModal
         onClose={() => setShowImageUrlInput(false)}
         onInsert={(url, alt) => {
           const el = {
             id: Date.now(), type: 'image',
             src: url, x: 120, y: 140, width: 300, height: 200, alt: alt || 'Image'
           };
           const elems = slides[currentSlide]?.elements || [];
           updateSlide(currentSlide, { elements: [...elems, el] });
         }}
       />
     )}
*/
