import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  res.json({ url: imageUrl, filename: req.file.originalname });
});

router.post('/presentation', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  // Mock PPTX parsing
  const mockSlides = [
    { id: 1, title: 'Imported Slide 1', content: 'Content from uploaded file' },
    { id: 2, title: 'Imported Slide 2', content: 'More imported content' }
  ];
  
  res.json({ slides: mockSlides, filename: req.file.originalname });
});

export default router;