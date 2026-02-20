import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const presentations = new Map();

router.post('/save', auth, (req, res) => {
  const { filename, data } = req.body;
  const id = `${req.user.email}_${filename}_${Date.now()}`;
  presentations.set(id, { filename, data, userId: req.user.email, createdAt: new Date() });
  res.json({ success: true, id });
});

router.get('/', auth, (req, res) => {
  const userPresentations = Array.from(presentations.entries())
    .filter(([_, p]) => p.userId === req.user.email)
    .map(([id, p]) => ({ id, filename: p.filename, createdAt: p.createdAt }));
  res.json(userPresentations);
});

router.get('/:id', auth, (req, res) => {
  const presentation = presentations.get(req.params.id);
  if (!presentation || presentation.userId !== req.user.email) {
    return res.status(404).json({ error: 'Presentation not found' });
  }
  res.json(presentation.data);
});

router.delete('/:id', auth, (req, res) => {
  presentations.delete(req.params.id);
  res.json({ success: true });
});

export default router;