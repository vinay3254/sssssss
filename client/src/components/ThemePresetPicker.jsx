import React from 'react';

const PRESETS = [
  {
    id: 'default',
    name: 'Default (Dark + Gold)',
    vars: {
      '--primary-dark': '#1B1A17',
      '--accent-gold': '#F0A500',
      '--text-light': '#FFFFFF',
      '--gold-hover': '#d48f00'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    vars: {
      '--primary-dark': '#0b132b',
      '--accent-gold': '#1c2541',
      '--text-light': '#e0e6f1',
      '--gold-hover': '#3a506b'
    }
  },
  {
    id: 'forest',
    name: 'Forest Green',
    vars: {
      '--primary-dark': '#0f1f14',
      '--accent-gold': '#2f6d3d',
      '--text-light': '#e6f2ea',
      '--gold-hover': '#3f8d50'
    }
  },
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    vars: {
      '--primary-dark': '#1e3a8a',
      '--accent-gold': '#3b82f6',
      '--text-light': '#ffffff',
      '--gold-hover': '#2563eb'
    }
  },
  {
    id: 'crimson',
    name: 'Crimson Red',
    vars: {
      '--primary-dark': '#7f1d1d',
      '--accent-gold': '#dc2626',
      '--text-light': '#ffffff',
      '--gold-hover': '#b91c1c'
    }
  },
  {
    id: 'purple',
    name: 'Deep Purple',
    vars: {
      '--primary-dark': '#581c87',
      '--accent-gold': '#9333ea',
      '--text-light': '#ffffff',
      '--gold-hover': '#7e22ce'
    }
  },
  {
    id: 'teal',
    name: 'Teal',
    vars: {
      '--primary-dark': '#115e59',
      '--accent-gold': '#14b8a6',
      '--text-light': '#ffffff',
      '--gold-hover': '#0d9488'
    }
  },
  {
    id: 'orange',
    name: 'Vibrant Orange',
    vars: {
      '--primary-dark': '#9a3412',
      '--accent-gold': '#f97316',
      '--text-light': '#ffffff',
      '--gold-hover': '#ea580c'
    }
  },
  {
    id: 'slate',
    name: 'Slate Gray',
    vars: {
      '--primary-dark': '#1e293b',
      '--accent-gold': '#475569',
      '--text-light': '#f1f5f9',
      '--gold-hover': '#334155'
    }
  }
];

const applyVars = (vars) => {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
};

const ThemePresetPicker = ({ onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="modal w-[420px]">
        <div className="modal-header">
          <h3 className="nav-title">Theme Presets</h3>
          <button onClick={onClose} className="btn-ghost">✕</button>
        </div>
        <div className="space-y-2">
          {PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => { applyVars(p.vars); onSelect?.(p.id); onClose?.(); }}
              className="w-full text-left dropdown-item"
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ThemePresetPicker;
