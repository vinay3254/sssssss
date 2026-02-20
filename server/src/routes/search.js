import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/presentations', auth, (req, res) => {
  const { q, category, sortBy } = req.query;
  
  // Mock search results
  const mockResults = [
    { id: 1, title: 'Business Plan 2024', category: 'business', lastModified: new Date(), matches: ['business', 'plan'] },
    { id: 2, title: 'Marketing Strategy', category: 'marketing', lastModified: new Date(), matches: ['marketing', 'strategy'] },
    { id: 3, title: 'Project Overview', category: 'project', lastModified: new Date(), matches: ['project', 'overview'] }
  ].filter(p => !q || p.title.toLowerCase().includes(q.toLowerCase()));
  
  res.json({ results: mockResults, total: mockResults.length });
});

router.get('/content', auth, (req, res) => {
  const { q } = req.query;
  
  const mockContent = [
    { slideId: 1, presentationId: 1, title: 'Introduction', content: 'Welcome to our presentation', match: q },
    { slideId: 2, presentationId: 1, title: 'Overview', content: 'Project overview and goals', match: q }
  ].filter(c => !q || c.content.toLowerCase().includes(q.toLowerCase()));
  
  res.json({ results: mockContent, total: mockContent.length });
});

export default router;