import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const rooms = new Map();

router.post('/create-room', auth, (req, res) => {
  const { presentationId, name } = req.body;
  const roomId = `room_${presentationId}_${Date.now()}`;
  
  rooms.set(roomId, {
    id: roomId,
    presentationId,
    name: name || 'Collaboration Room',
    owner: req.user.email,
    participants: [req.user.email],
    createdAt: new Date()
  });
  
  res.json({ roomId, shareLink: `${process.env.CLIENT_URL}/collaborate/${roomId}` });
});

router.get('/room/:roomId', auth, (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  
  res.json(room);
});

router.post('/join/:roomId', auth, (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  
  if (!room.participants.includes(req.user.email)) {
    room.participants.push(req.user.email);
  }
  
  res.json({ message: 'Joined room successfully', room });
});

export default router;