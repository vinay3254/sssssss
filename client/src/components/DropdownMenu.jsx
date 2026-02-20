import { useEffect, useRef, useState } from 'react';

/**
 * Reusable dropdown menu with:
 * - Smooth open/close state
 * - Click-outside to close
 * - Keyboard navigation (Esc, ArrowUp/Down, Enter/Space)
 * - A11y roles
 *
 * Usage:
 * <DropdownMenu label="File">
 *   <DropdownItem onSelect={...}>New</DropdownItem>
 *   <DropdownItem onSelect={...}>Save As</DropdownItem>
 *   <DropdownSeparator />
 *   <DropdownItem onSelect={...}>Close</DropdownItem>
 * </DropdownMenu>
 */
export default function DropdownMenu({
  label,
  buttonClassName = '',
  menuClassName = '',
  align = 'left', // 'left' | 'right'
  children,
  title,
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (!menuRef.current || !btnRef.current) return;
      if (menuRef.current.contains(e.target)) return;
      if (btnRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && open) {
        e.preventDefault();
        const items = Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') || []);
        if (!items.length) return;
        // Focus first/last depending on key
        if (e.key === 'ArrowDown') {
          (items[0] /** first */)?.focus();
        } else if (e.key === 'ArrowUp') {
          (items[items.length - 1] /** last */)?.focus();
        }
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Align class
  const alignClass = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className={buttonClassName || 'px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200'}
        aria-haspopup="menu"
        aria-expanded={open}
        title={title || label}
      >
        {label}
      </button>

      <div
        ref={menuRef}
        role="menu"
        aria-label={label}
        className={`dropdown-menu ${menuClassName} ${alignClass} mt-2 transition-all duration-150 origin-top ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
        style={{ minWidth: 200 }}
      >
        {children}
      </div>
    </div>
  );
}

export function DropdownItem({ onSelect, children, disabled = false, title }) {
  const ref = useRef(null);
  const onKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.();
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = Array.from(ref.current?.parentElement?.querySelectorAll('[role="menuitem"]') || []);
      const idx = items.indexOf(ref.current);
      if (idx === -1) return;
      const nextIdx = e.key === 'ArrowDown' ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length;
      items[nextIdx]?.focus();
    }
  };

  return (
    <button
      ref={ref}
      role="menuitem"
      onClick={() => !disabled && onSelect?.()}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={`dropdown-item w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
    >
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-[rgba(240,165,0,0.08)]" />;
}
