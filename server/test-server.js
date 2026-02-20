import express from 'express';
import cors from 'cors';
import emailService from './src/services/emailService.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const otpStorage = new Map();

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStorage.set(email, { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

  // Send OTP via email service (no OTP exposure in response or logs)
  try {
    await emailService.sendOTP(email, otp);
  } catch (err) {
    console.warn('⚠️ Failed to send OTP email');
  }
  
  res.json({
    message: 'OTP sent successfully',
    email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  const stored = otpStorage.get(email);
  if (!stored || stored.otp !== otp || new Date() > stored.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  
  otpStorage.delete(email);
  res.json({ verified: true, message: 'OTP verified successfully' });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
});