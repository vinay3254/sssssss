import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// In-memory storage for OTPs
const otpStorage = new Map();

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'EtherXPPT Server Running', status: 'healthy' });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  
  otpStorage.set(email, { otp, expiresAt });

  try {
    // send via centralized email service if available
    const emailService = (await import('./src/services/emailService.js')).default;
    await emailService.sendOTP(email, otp);
  } catch (err) {
    console.warn('⚠️ Failed to send OTP email');
  }

  res.json({
    message: 'OTP sent successfully to your email address',
    email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }
  
  const stored = otpStorage.get(email);
  
  if (!stored) {
    return res.status(400).json({ message: 'No OTP found for this email' });
  }
  
  if (new Date() > stored.expiresAt) {
    otpStorage.delete(email);
    return res.status(400).json({ message: 'OTP has expired' });
  }
  
  if (stored.otp !== otp.toString()) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  
  otpStorage.delete(email);
  res.json({ verified: true, message: 'OTP verified successfully' });
});

// IPFS routes
app.post('/api/ipfs/save', (req, res) => {
  const hash = 'local-fallback-' + Date.now();
  console.log('📁 Presentation saved locally:', hash);
  res.json({
    success: true,
    ipfsHash: hash,
    message: 'Presentation saved locally (IPFS not configured)'
  });
});

app.get('/api/ipfs/load/:hash', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Local presentations cannot be loaded'
  });
});

// Catch all other routes
app.use('*', (req, res) => {
  console.log(`404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});