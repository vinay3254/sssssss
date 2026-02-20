import React, { useState, useEffect } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const AnimationPanel = () => {
  const { slides, currentSlide, updateSlide, animationPreview, setAnimationPreview, selectedAnimation, setSelectedAnimation } = usePresentation();
  const [selectedElement, setSelectedElement] = useState('');

  const slide = slides[currentSlide] || {};
  const animations = slide.animations || [];

  const animationTypes = [
    { id: 'fadeIn', name: 'Fade In', icon: '🌅' },
    { id: 'slideInLeft', name: 'Slide In Left', icon: '⬅️' },
    { id: 'slideInRight', name: 'Slide In Right', icon: '➡️' },
    { id: 'slideInUp', name: 'Slide In Up', icon: '⬆️' },
    { id: 'slideInDown', name: 'Slide In Down', icon: '⬇️' },
    { id: 'zoomIn', name: 'Zoom In', icon: '🔍' },
    { id: 'bounce', name: 'Bounce', icon: '⚡' },
    { id: 'pulse', name: 'Pulse', icon: '💓' },
    { id: 'float', name: 'Float In', icon: '🎈' },
    { id: 'rotate', name: 'Rotate', icon: '🌀' }
  ];

  const addAnimation = (target, animationType) => {
    // Remove any existing animations for this target to ensure only one animation per target
    const filteredAnimations = animations.filter(a => a.target !== target);

    // Use animation defaults from slide if available, otherwise use hardcoded defaults
    const defaults = slide.animationDefaults || {};
    const defaultDuration = defaults.duration ? defaults.duration * 1000 : 1000; // Convert seconds to ms
    const defaultDelay = defaults.delay ? defaults.delay * 1000 : 0; // Convert seconds to ms

    const newAnimation = {
      id: Date.now(),
      target, // 'title' | 'content' | elementId
      type: animationType,
      duration: defaultDuration,
      delay: defaultDelay,
      order: filteredAnimations.length
    };

    // Update slide with filtered animations plus the new one
    const updatedAnimations = [...filteredAnimations, newAnimation];
    updateSlide(currentSlide, { animations: updatedAnimations });

    // Update the selected animation to track current selection
    setSelectedAnimation({ target, type: animationType, id: newAnimation.id });
  };

  const updateAnimation = (id, field, value) => {
    const updated = animations.map(a => (a.id === id ? { ...a, [field]: value } : a));
    updateSlide(currentSlide, { animations: updated });
  };

  const moveAnimation = (id, dir) => {
    const idx = animations.findIndex(a => a.id === id);
    if (idx === -1) return;
    const newOrder = [...animations];
    const swapWith = dir === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= newOrder.length) return;
    const tmp = newOrder[idx];
    newOrder[idx] = newOrder[swapWith];
    newOrder[swapWith] = tmp;
    // Reassign order values
    const reassigned = newOrder.map((a, i) => ({ ...a, order: i }));
    updateSlide(currentSlide, { animations: reassigned });
  };

  const previewAnimations = () => {
    if (animations.length === 0) return;
    
    // First reset any existing animation
    setAnimationPreview({ active: false, animations: [] });
    
    // Then trigger new animation after a brief delay
    setTimeout(() => {
      setAnimationPreview({ active: true, animations });
      
      // Calculate max animation time (duration + delay)
      const maxTime = Math.max(...animations.map(a => (a.duration || 1000) + (a.delay || 0)));
      
      // Reset after all animations complete
      setTimeout(() => {
        setAnimationPreview({ active: false, animations: [] });
      }, maxTime + 500); // Add 500ms buffer
    }, 100);
  };

  const removeAnimation = (animationId) => {
    const updatedAnimations = animations.filter(a => a.id !== animationId);
    updateSlide(currentSlide, { animations: updatedAnimations });
  };

  const elements = slide.elements || [];

  // Sync selectedAnimation state when animations change
  useEffect(() => {
    if (selectedElement && animations.length > 0) {
      const currentAnimation = animations.find(a => a.target === selectedElement);
      if (currentAnimation) {
        setSelectedAnimation({ 
          target: currentAnimation.target, 
          type: currentAnimation.type, 
          id: currentAnimation.id 
        });
      } else {
        setSelectedAnimation(null);
      }
    }
  }, [animations, selectedElement, setSelectedAnimation]);

  return (
    <div className="w-64 panel p-4">
      {/* Panel title uses nav-title for consistent gold color */}
      <h3 className="text-sm font-medium nav-title mb-4">🎬 Animations</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-2">Target</label>
          <select
            value={selectedElement}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="form-select"
          >
            <option value="">Choose target...</option>
            <option value="title">Title</option>
            <option value="content">Content</option>
            {elements.map(el => (
              <option key={el.id} value={el.id}>{el.type} - {el.id}</option>
            ))}
          </select>
        </div>

        {selectedElement && (
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">Animation Type</label>
            <div className="grid grid-cols-2 gap-2">
              {animationTypes.map(anim => {
                const currentAnimation = animations.find(a => a.target === selectedElement && a.type === anim.id);
                const isActive = !!currentAnimation;
                
                return (
                  <div key={anim.id} className="relative">
                    <button 
                      onClick={() => addAnimation(selectedElement, anim.id)} 
                      className={`flex flex-col items-center justify-center p-2 text-xs transition-all w-full ${
                        isActive 
                          ? 'bg-primary-500 text-white border-primary-600' 
                          : 'btn-secondary'
                      }`}
                    >
                      <div>{anim.icon}</div>
                      <div className="mt-1">{anim.name}</div>
                    </button>
                    <button
                      onClick={() => {
                        const tempAnimation = {
                          id: Date.now(),
                          target: selectedElement,
                          type: anim.id,
                          duration: 1000,
                          delay: 0
                        };
                        setAnimationPreview({ active: false, animations: [] });
                        setTimeout(() => {
                          setAnimationPreview({ active: true, animations: [tempAnimation] });
                          setTimeout(() => {
                            setAnimationPreview({ active: false, animations: [] });
                          }, 1500);
                        }, 100);
                      }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center hover:bg-blue-600"
                      title="Preview this animation"
                    >
                      ▶
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-2">Current Animations</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {animations.map(anim => (
              <div key={anim.id} className="p-2 card">
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="font-medium">{anim.type}</div>
                    <div className="text-neutral-400">Target: {anim.target}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-ghost" onClick={() => moveAnimation(anim.id, 'up')} title="Move Up">▲</button>
                    <button className="btn-ghost" onClick={() => moveAnimation(anim.id, 'down')} title="Move Down">▼</button>
                    <button className="text-red-400 hover:text-red-600" onClick={() => removeAnimation(anim.id)} title="Remove">×</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-[10px] text-neutral-400 mb-1">Duration (ms)</label>
                    <input type="number" className="form-input" value={anim.duration} onChange={(e) => updateAnimation(anim.id, 'duration', parseInt(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400 mb-1">Delay (ms)</label>
                    <input type="number" className="form-input" value={anim.delay} onChange={(e) => updateAnimation(anim.id, 'delay', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </div>
            ))}
            {animations.length === 0 && (
              <div className="text-xs text-neutral-400 text-center py-4">No animations added</div>
            )}
          </div>
          <div className="mt-3">
            <button className="btn-secondary w-full" onClick={previewAnimations}>Preview All</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationPanel;