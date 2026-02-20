import express from 'express';
const router = express.Router();

const speakerNotes = new Map();

// Save speaker notes
router.post('/save', (req, res) => {
  const { slideId, notes, userId } = req.body;
  const noteId = `note_${slideId}_${userId}`;
  speakerNotes.set(noteId, {
    slideId,
    notes,
    userId,
    updated: new Date()
  });
  res.json({ success: true, noteId });
});

// Get speaker notes
router.get('/:slideId', (req, res) => {
  const { slideId } = req.params;
  const userId = req.query.userId;
  const noteId = `note_${slideId}_${userId}`;
  const note = speakerNotes.get(noteId);
  res.json({ notes: note?.notes || '' });
});

// Get all notes for presentation
router.get('/presentation/:presentationId', (req, res) => {
  const { presentationId } = req.params;
  const userId = req.query.userId;
  const presentationNotes = Array.from(speakerNotes.values())
    .filter(n => n.userId === userId);
  res.json({ notes: presentationNotes });
});

// Delete notes
router.delete('/:slideId', (req, res) => {
  const { slideId } = req.params;
  const userId = req.query.userId;
  const noteId = `note_${slideId}_${userId}`;
  speakerNotes.delete(noteId);
  res.json({ success: true });
});

export default router;