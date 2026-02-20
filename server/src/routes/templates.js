import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const templates = [
  { id: 1, name: 'Business Presentation', category: 'business', slides: [{ title: 'Welcome', content: 'Business template' }] },
  { id: 2, name: 'Academic Presentation', category: 'education', slides: [{ title: 'Research', content: 'Academic template' }] },
  { id: 3, name: 'Creative Portfolio', category: 'creative', slides: [{ title: 'Portfolio', content: 'Creative template' }] }
];

router.get('/', (req, res) => {
  res.json(templates);
});

router.get('/:id', (req, res) => {
  const template = templates.find(t => t.id == req.params.id);
  res.json(template || { error: 'Template not found' });
});

export default router;