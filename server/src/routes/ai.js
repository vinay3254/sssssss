import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-content', auth, (req, res) => {
  const { prompt, type } = req.body;
  const mockResponses = {
    title: `Generated Title: ${prompt}`,
    content: `Generated content based on: ${prompt}. This is a mock AI response.`,
    bullet: `• ${prompt}\n• Key point 1\n• Key point 2`
  };
  res.json({ content: mockResponses[type] || mockResponses.content });
});

router.post('/improve-text', auth, (req, res) => {
  const { text } = req.body;
  res.json({ improvedText: `Enhanced: ${text} - Made more professional and engaging.` });
});

export default router;