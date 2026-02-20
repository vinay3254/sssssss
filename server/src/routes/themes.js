import express from 'express';
const router = express.Router();

const themes = new Map();
const defaultThemes = [
  { id: 'dark', name: 'Dark Theme', colors: { bg: '#1B1A17', accent: '#F0A500' } },
  { id: 'light', name: 'Light Theme', colors: { bg: '#FFFFFF', accent: '#007ACC' } },
  { id: 'blue', name: 'Blue Theme', colors: { bg: '#1E3A8A', accent: '#60A5FA' } }
];

// Get all themes
router.get('/', (req, res) => {
  const userThemes = Array.from(themes.values());
  res.json({ themes: [...defaultThemes, ...userThemes] });
});

// Save custom theme
router.post('/save', (req, res) => {
  const { name, colors, userId } = req.body;
  const themeId = `custom_${Date.now()}`;
  themes.set(themeId, { id: themeId, name, colors, userId, created: new Date() });
  res.json({ success: true, themeId });
});

// Apply theme
router.post('/apply', (req, res) => {
  const { themeId, userId } = req.body;
  res.json({ success: true, applied: themeId });
});

export default router;