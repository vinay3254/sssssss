import express from 'express';
const router = express.Router();

const drawings = new Map();

// Save drawing
router.post('/save', (req, res) => {
  const { slideId, drawingData, tool } = req.body;
  const drawingId = `draw_${Date.now()}`;
  drawings.set(drawingId, {
    slideId,
    data: drawingData,
    tool,
    created: new Date()
  });
  res.json({ success: true, drawingId });
});

// Get drawings for slide
router.get('/slide/:slideId', (req, res) => {
  const slideDrawings = Array.from(drawings.values())
    .filter(d => d.slideId === req.params.slideId);
  res.json({ drawings: slideDrawings });
});

// Get drawing tools
router.get('/tools', (req, res) => {
  res.json({
    tools: [
      { id: 'pen', name: 'Pen', icon: '✏️' },
      { id: 'brush', name: 'Brush', icon: '🖌️' },
      { id: 'eraser', name: 'Eraser', icon: '🧽' },
      { id: 'line', name: 'Line', icon: '📏' },
      { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
      { id: 'circle', name: 'Circle', icon: '⭕' }
    ]
  });
});

// Delete drawing
router.delete('/:drawingId', (req, res) => {
  drawings.delete(req.params.drawingId);
  res.json({ success: true });
});

export default router;