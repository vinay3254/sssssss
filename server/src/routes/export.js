import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/pdf', auth, (req, res) => {
  const { slides, options } = req.body;
  
  // Mock PDF generation
  setTimeout(() => {
    res.json({ 
      success: true, 
      downloadUrl: `/api/export/download/pdf_${Date.now()}.pdf`,
      message: 'PDF generated successfully'
    });
  }, 2000);
});

router.post('/pptx', auth, (req, res) => {
  const { slides, options } = req.body;
  
  setTimeout(() => {
    res.json({ 
      success: true, 
      downloadUrl: `/api/export/download/presentation_${Date.now()}.pptx`,
      message: 'PPTX generated successfully'
    });
  }, 1500);
});

router.post('/html', auth, (req, res) => {
  const { slides } = req.body;
  
  const htmlContent = slides.map(slide => 
    `<div class="slide"><h1>${slide.title}</h1><p>${slide.content}</p></div>`
  ).join('');
  
  res.json({ 
    success: true, 
    html: `<html><body>${htmlContent}</body></html>`,
    downloadUrl: `/api/export/download/presentation_${Date.now()}.html`
  });
});

router.get('/download/:filename', (req, res) => {
  res.json({ message: 'File download would start here', filename: req.params.filename });
});

export default router;