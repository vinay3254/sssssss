import React, { useState } from 'react';

const HeaderFooterModal = ({ onClose, meta, onSave }) => {
  const [header, setHeader] = useState(meta.header || { default: '', first: '', even: '', odd: '' });
  const [footer, setFooter] = useState(meta.footer || { default: '', first: '', even: '', odd: '' });

  const save = () => {
    onSave({ header, footer });
    onClose?.();
  };

  const Field = ({ label, value, onChange, placeholder }) => (
    <div>
      <label className="block text-xs font-medium text-neutral-300 mb-1">{label}</label>
      <input
        type="text"
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="modal w-[640px]">
        <div className="modal-header">
          <h3 className="nav-title">Header & Footer</h3>
          <button onClick={onClose} className="btn-ghost">✕</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="panel">
            <h4 className="mb-2 font-semibold">Header</h4>
            <div className="space-y-2">
              <Field label="Default" value={header.default} onChange={(v) => setHeader({ ...header, default: v })} placeholder="e.g., {page} / {total}" />
              <Field label="First Slide" value={header.first} onChange={(v) => setHeader({ ...header, first: v })} placeholder="Optional" />
              <Field label="Even Slides" value={header.even} onChange={(v) => setHeader({ ...header, even: v })} placeholder="Optional" />
              <Field label="Odd Slides" value={header.odd} onChange={(v) => setHeader({ ...header, odd: v })} placeholder="Optional" />
            </div>
          </div>
          <div className="panel">
            <h4 className="mb-2 font-semibold">Footer</h4>
            <div className="space-y-2">
              <Field label="Default" value={footer.default} onChange={(v) => setFooter({ ...footer, default: v })} placeholder="e.g., Project Name" />
              <Field label="First Slide" value={footer.first} onChange={(v) => setFooter({ ...footer, first: v })} placeholder="Optional" />
              <Field label="Even Slides" value={footer.even} onChange={(v) => setFooter({ ...footer, even: v })} placeholder="Optional" />
              <Field label="Odd Slides" value={footer.odd} onChange={(v) => setFooter({ ...footer, odd: v })} placeholder="Optional" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={save} className="btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
};

export default HeaderFooterModal;
