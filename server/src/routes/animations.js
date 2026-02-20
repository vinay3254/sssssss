import express from 'express';
const router = express.Router();

const animations = new Map();

// Save animation
router.post('/save', (req, res) => {
  const { slideId, elementId, animation } = req.body;
  const animId = `anim_${Date.now()}`;
  animations.set(animId, {
    slideId,
    elementId,
    animation,
    created: new Date()
  });
  res.json({ success: true, animationId: animId });
});

// Get animations for slide
router.get('/slide/:slideId', (req, res) => {
  const slideAnimations = Array.from(animations.values())
    .filter(a => a.slideId === req.params.slideId);
  res.json({ animations: slideAnimations });
});

// Get animation presets
router.get('/presets', (req, res) => {
  res.json({
    presets: [
      { id: 'fadeIn', name: 'Fade In', duration: 500 },
      { id: 'slideIn', name: 'Slide In', duration: 300 },
      { id: 'bounce', name: 'Bounce', duration: 600 },
      { id: 'zoom', name: 'Zoom', duration: 400 },
      { id: 'rotate', name: 'Rotate', duration: 500 },
      { id: 'flip', name: 'Flip', duration: 600 }
    ]
  });
});

// Apply animation
router.post('/apply', (req, res) => {
  const { slideId, elementId, preset } = req.body;
  res.json({ success: true, applied: preset });
});

export default router;