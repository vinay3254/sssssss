import jwt from 'jsonwebtoken';
import jsonDb from '../utils/jsonDatabase.js';
import emailService from '../services/emailService.js';

const otpStorage = new Map();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '7d'
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    const firstName = (req.body.firstName || '').trim();
    const lastName = (req.body.lastName || '').trim();

    name = (name || '').trim();
    if (!name) {
      const parts = [firstName, lastName].filter(Boolean);
      name = parts.join(' ').trim();
    }

    email = (email || '').trim().toLowerCase();

    // Basic validation
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !email || !password || !isEmailValid) {
      return res.status(400).json({ message: 'All fields are required and email must be valid' });
    }

    // Debug (avoid logging password)
    console.log('Register attempt:', { email, nameLength: name.length });

    const existingUser = await jsonDb.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const user = await jsonDb.createUser({ name, email, password });
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = (email || '').trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await jsonDb.validatePassword(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    email = (email || '').trim().toLowerCase();
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const user = await jsonDb.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    otpStorage.set(email, { otp, expiresAt });
    // OTP generated and stored. OTP will be sent to the user's email and must not be exposed to the client.

    // Send OTP via email
    let emailSendSucceeded = false;
    try {
      const emailResult = await emailService.sendOTP(email, otp, user.name);
      console.log('✅ OTP sent to email successfully');
      emailSendSucceeded = true;
    } catch (error) {
      console.log('⚠️ Email failed to send OTP, please check email configuration');
    }

    const responsePayload = {
      message: 'OTP sent successfully to your email address',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    };

    res.json(responsePayload);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = (email || '').trim().toLowerCase();

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otpStorage.get(email);
    
    if (!storedData) {
      return res.status(400).json({ message: 'No OTP found for this email. Please request a new OTP.' });
    }

    if (new Date() > storedData.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (storedData.otp !== otp.toString()) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    res.json({
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = (email || '').trim().toLowerCase();

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otpStorage.get(email);
    
    if (!storedData) {
      return res.status(400).json({ message: 'No OTP found for this email. Please request a new OTP.' });
    }

    if (new Date() > storedData.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (storedData.otp !== otp.toString()) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    // Complete registration if userData exists
    if (storedData.userData) {
      const user = await jsonDb.createUser(storedData.userData);
      const token = generateToken(user.id);
      otpStorage.delete(email);
      
      return res.json({
        message: 'Email verified and account created successfully',
        verified: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    }

    res.json({
      message: 'Email verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

export const resendVerification = async (req, res) => {
  try {
    let { email } = req.body;
    email = (email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const storedData = otpStorage.get(email);
    if (!storedData || !storedData.userData) {
      return res.status(400).json({ message: 'No pending verification found for this email' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    otpStorage.set(email, { otp, expiresAt, userData: storedData.userData });

    try {
      await emailService.sendVerificationOTP(email, otp, storedData.userData.name);
    } catch (error) {
      console.log(`🔑 New verification OTP generated for ${email}`);
    }

    res.json({
      message: 'New verification OTP sent to your email'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error while resending OTP' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;
    email = (email || '').trim().toLowerCase();

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const storedData = otpStorage.get(email);
    
    if (!storedData || storedData.otp !== otp || new Date() > storedData.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await jsonDb.findUserByEmail(email);
    const success = await jsonDb.updateUserPassword(email, newPassword);
    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }

    otpStorage.delete(email);

    // Send confirmation email
    await emailService.sendPasswordResetConfirmation(email, user.name);

    res.json({
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const users = await jsonDb.readUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};