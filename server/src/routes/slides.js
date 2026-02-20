import express from 'express';
const router = express.Router();

// In-memory storage for slides
const slidesData = new Map();

// Save slide content
router.post('/save', (req, res) => {
  const { slideId, content, formatting } = req.body;
  slidesData.set(slideId, { content, formatting, updated: new Date() });
  res.json({ success: true, slideId });
});

// Get slide content
router.get('/:slideId', (req, res) => {
  const slide = slidesData.get(req.params.slideId);
  res.json(slide || { content: '', formatting: {} });
});

// Update slide formatting
router.post('/format', (req, res) => {
  const { slideId, formatting } = req.body;
  const slide = slidesData.get(slideId) || {};
  slide.formatting = { ...slide.formatting, ...formatting };
  slidesData.set(slideId, slide);
  res.json({ success: true });
});

// Add element to slide
router.post('/elements', (req, res) => {
  const { slideId, element } = req.body;
  const slide = slidesData.get(slideId) || { elements: [] };
  slide.elements = slide.elements || [];
  slide.elements.push({ ...element, id: Date.now() });
  slidesData.set(slideId, slide);
  res.json({ success: true, elementId: slide.elements[slide.elements.length - 1].id });
});

export default router;