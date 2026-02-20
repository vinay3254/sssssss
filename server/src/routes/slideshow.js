import express from 'express';
const router = express.Router();

const slideshowSessions = new Map();

// Start slideshow
router.post('/start', (req, res) => {
  const { presentationId, userId } = req.body;
  const sessionId = `show_${Date.now()}`;
  slideshowSessions.set(sessionId, {
    presentationId,
    userId,
    currentSlide: 0,
    started: new Date(),
    status: 'active'
  });
  res.json({ success: true, sessionId });
});

// Navigate slideshow
router.post('/navigate', (req, res) => {
  const { sessionId, slideIndex, direction } = req.body;
  const session = slideshowSessions.get(sessionId);
  if (session) {
    session.currentSlide = slideIndex;
    session.lastUpdate = new Date();
    res.json({ success: true, currentSlide: slideIndex });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// End slideshow
router.post('/end', (req, res) => {
  const { sessionId } = req.body;
  slideshowSessions.delete(sessionId);
  res.json({ success: true });
});

// Get slideshow status
router.get('/status/:sessionId', (req, res) => {
  const session = slideshowSessions.get(req.params.sessionId);
  res.json(session || { error: 'Session not found' });
});

export default router;