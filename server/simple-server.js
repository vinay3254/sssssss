import express from 'express';
import cors from 'cors';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
const app = express();
const PORT = 3000;
import dotenv from 'dotenv';
dotenv.config();

const USERS_FILE = './users.json'; 

// ✅ Fixed CORS - allows both 5173 and 5174
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

const OTP_FILE = './otp-store.json';

const saveOTP = (email, otpData) => {
  let data = {};
  if (fs.existsSync(OTP_FILE)) {
    data = JSON.parse(fs.readFileSync(OTP_FILE));
  }
  data[email] = otpData;
  fs.writeFileSync(OTP_FILE, JSON.stringify(data, null, 2));
};

const getUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
};

const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const getOTP = (email) => {
  if (!fs.existsSync(OTP_FILE)) return null;
  const data = JSON.parse(fs.readFileSync(OTP_FILE));
  return data[email] || null;
};

const deleteOTP = (email) => {
  if (!fs.existsSync(OTP_FILE)) return;
  const data = JSON.parse(fs.readFileSync(OTP_FILE));
  delete data[email];
  fs.writeFileSync(OTP_FILE, JSON.stringify(data, null, 2));
};
/* ===============================
   REGISTER
================================= */
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const users = getUsers();
  if (users.find(u => u.email === normalizedEmail)) {
    return res.status(409).json({ message: 'User already exists with this email' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = {
    id: Date.now().toString(),
    name,
    email: normalizedEmail,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  });
});

/* ===============================
   LOGIN
================================= */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const users = getUsers();
  const user = users.find(u => u.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

/* ===============================
   STORE OTP (frontend calls this after EmailJS sends it)
================================= */
app.post('/api/auth/store-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP required' });
  }
  const normalizedEmail = email.trim().toLowerCase();
  saveOTP(normalizedEmail, {
    otp: String(otp),
    expiresAt: Date.now() + 10 * 60 * 1000
  });
  console.log("💾 Stored OTP for:", normalizedEmail);
  res.json({ success: true });
});

/* ===============================
   VERIFY OTP
================================= */
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  console.log("📩 Email:", normalizedEmail);
  console.log("🔐 Entered OTP:", otp);

  const stored = getOTP(normalizedEmail);
  console.log("🗂 Stored:", stored);

  if (!stored) {
    return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
  }
  if (Date.now() > stored.expiresAt) {
    deleteOTP(normalizedEmail);
    return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
  }
  if (stored.otp !== String(otp)) {
    return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
  }

  // ✅ Don't delete yet - needed for reset-password step
  res.json({ verified: true });
});

/* ===============================
   RESET PASSWORD
================================= */
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const stored = getOTP(normalizedEmail);

  if (!stored) {
    return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
  }
  if (Date.now() > stored.expiresAt) {
    deleteOTP(normalizedEmail);
    return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
  }
  if (stored.otp !== String(otp)) {
    return res.status(400).json({ message: 'Invalid OTP.' });
  }

  // ✅ ACTUALLY UPDATE THE PASSWORD
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === normalizedEmail);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  users[userIndex].password = hashedPassword;
  
  // Save updated users
  saveUsers(users);
  
  deleteOTP(normalizedEmail);
  console.log("✅ Password reset for:", normalizedEmail);

  res.json({ success: true, message: 'Password reset successfully' });
});
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});