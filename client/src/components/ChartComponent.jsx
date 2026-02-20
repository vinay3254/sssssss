import React, { useMemo, useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

/*
  Unified chart editor for insert (and can be reused for edit):
  Produces elements of shape:
  {
    id,
    type: 'chart',
    chartType: 'bar' | 'line' | 'pie' | 'doughnut',
    data: {
      labels: string[],
      datasets: [{ label: string, color: string, data: number[] }]
    },
    options: { legend: boolean, dataLabels: boolean },
    x, y, width, height, title
  }
*/
const DEFAULT_LABELS = ['Q1', 'Q2', 'Q3', 'Q4'];
const DEFAULT_DATA = [30, 45, 60, 40];
const DEFAULT_COLOR = '#3B82F6';

const ChartComponent = ({ onClose, elementIndex = null }) => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const slide = slides[currentSlide];

  const existing = useMemo(() => {
    if (elementIndex == null) return null;
    const el = (slide.elements || [])[elementIndex];
    return el && el.type === 'chart' ? el : null;
  }, [elementIndex, slide]);

  const [chartType, setChartType] = useState(existing?.chartType || 'bar');
  const [labels, setLabels] = useState(existing?.data?.labels || DEFAULT_LABELS);
  const [datasets, setDatasets] = useState(
    existing?.data?.datasets || [{ label: 'Series 1', color: DEFAULT_COLOR, data: DEFAULT_DATA }]
  );
  const [title, setTitle] = useState(existing?.title || 'Chart Title');
  const [legend, setLegend] = useState(existing?.options?.legend ?? true);
  const [dataLabels, setDataLabels] = useState(existing?.options?.dataLabels ?? true);

  const addLabel = () => {
    const name = `Label ${labels.length + 1}`;
    const newLabels = [...labels, name];
    setLabels(newLabels);
    setDatasets(ds => ds.map(d => ({ ...d, data: [...d.data, 0] })));
  };

  const removeLabel = (idx) => {
    const newLabels = labels.filter((_, i) => i !== idx);
    setLabels(newLabels);
    setDatasets(ds => ds.map(d => ({ ...d, data: d.data.filter((_, i) => i !== idx) })));
  };

  const updateLabel = (idx, value) => {
    const newLabels = [...labels];
    newLabels[idx] = value;
    setLabels(newLabels);
  };

  const addDataset = () => {
    const seriesIndex = datasets.length + 1;
    setDatasets([...datasets, { label: `Series ${seriesIndex}`, color: DEFAULT_COLOR, data: labels.map(() => 0) }]);
  };

  const removeDataset = (idx) => {
    setDatasets(datasets.filter((_, i) => i !== idx));
  };

  const updateDatasetField = (dIdx, field, value) => {
    const next = datasets.map((d, i) => (i === dIdx ? { ...d, [field]: value } : d));
    setDatasets(next);
  };

  const updateDatasetValue = (dIdx, lIdx, value) => {
    const next = datasets.map((d, i) => {
      if (i !== dIdx) return d;
      const vals = [...d.data];
      vals[lIdx] = parseFloat(value) || 0;
      return { ...d, data: vals };
    });
    setDatasets(next);
  };

  const saveChart = () => {
    const element = {
      id: existing?.id ?? Date.now(),
      type: 'chart',
      chartType,
      data: { labels, datasets },
      options: { legend, dataLabels },
      x: existing?.x ?? 100,
      y: existing?.y ?? 100,
      width: existing?.width ?? 480,
      height: existing?.height ?? 320,
      title
    };

    const elements = slide.elements || [];
    let nextElements;
    if (existing && elementIndex != null) {
      nextElements = elements.map((el, i) => (i === elementIndex ? element : el));
    } else {
      nextElements = [...elements, element];
    }
    updateSlide(currentSlide, { elements: nextElements });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="modal w-[720px] max-h-[85vh] overflow-y-auto">
        <div className="p-4 modal-header">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium" style={{ color: 'var(--accent-gold)' }}>{existing ? 'Edit Chart' : 'Insert Chart'}</h3>
            <button onClick={onClose} className="btn-ghost" aria-label="Close chart editor">✕</button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-light)' }}>Chart Type</label>
              <select 
                value={chartType} 
                onChange={(e) => setChartType(e.target.value)}
                className="form-select"
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="doughnut">Doughnut</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-light)' }}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                placeholder="Chart Title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-light)' }}>Labels</label>
                <button onClick={addLabel} className="btn-secondary">+ Add Label</button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {labels.map((lbl, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={lbl}
                      onChange={(e) => updateLabel(idx, e.target.value)}
                      className="flex-1 form-input"
                      placeholder={`Label ${idx + 1}`}
                    />
                    <button onClick={() => removeLabel(idx)} className="btn-ghost text-red-400" aria-label={`Remove label ${idx + 1}`}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-light)' }}>Datasets</label>
                <button onClick={addDataset} className="btn-secondary">+ Add Dataset</button>
              </div>
              <div className="space-y-4 max-h-48 overflow-y-auto">
                {datasets.map((ds, dIdx) => (
                  <div key={dIdx} className="p-2 rounded-lg border border-[rgba(240,165,0,0.12)]">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={ds.label}
                        onChange={(e) => updateDatasetField(dIdx, 'label', e.target.value)}
                        className="flex-1 form-input"
                        placeholder={`Series ${dIdx + 1}`}
                      />
                      <input
                        type="color"
                        value={ds.color || DEFAULT_COLOR}
                        onChange={(e) => updateDatasetField(dIdx, 'color', e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer form-input"
                        title="Series Color"
                      />
                      <button onClick={() => removeDataset(dIdx)} className="btn-ghost text-red-400" aria-label={`Remove dataset ${dIdx + 1}`}>×</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {labels.map((_, lIdx) => (
                        <div key={`${dIdx}-${lIdx}`} className="flex items-center gap-2">
                          <span className="text-xs opacity-70 min-w-[48px]">{labels[lIdx]}</span>
                          <input
                            type="number"
                            value={ds.data[lIdx] ?? 0}
                            onChange={(e) => updateDatasetValue(dIdx, lIdx, e.target.value)}
                            className="form-input"
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2" style={{ borderTop: '1px solid rgba(240,165,0,0.06)' }}>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={legend} onChange={(e) => setLegend(e.target.checked)} />
              Show legend
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={dataLabels} onChange={(e) => setDataLabels(e.target.checked)} />
              Show data labels
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={saveChart} className="btn-primary">{existing ? 'Save' : 'Insert Chart'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
