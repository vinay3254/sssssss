import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jsonAuthRoutes from './src/routes/jsonAuth.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET not set, using fallback');
  process.env.JWT_SECRET = 'fallback-jwt-secret-change-in-production';
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'EtherXPPT JSON Auth Server Running',
    version: '2.0.0',
    status: 'healthy'
  });
});

app.use('/api/auth', jsonAuthRoutes);

// Basic stubs for other routes
app.use('/api/cloud', (req, res) => res.json({ message: 'Cloud service not implemented' }));
app.use('/api/presentations', (req, res) => res.json({ presentations: [] }));
app.use('/api/ai', (req, res) => res.json({ message: 'AI service not implemented' }));
app.use('/api/templates', (req, res) => res.json({ templates: [] }));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-presentation', (presentationId) => {
    socket.join(presentationId);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`🚀 JSON Auth Server running on port ${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`📁 Using JSON file database`);
});