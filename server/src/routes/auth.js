import express from 'express';
import {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getProfile
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateOTPVerification,
  validatePasswordReset
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/verify-otp', validateOTPVerification, verifyOTP);
router.post('/reset-password', validatePasswordReset, resetPassword);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured. Please use production server.' });
    }

    // Import User model here to avoid circular dependency
    const User = (await import('../models/User.js')).default;
    
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
});

export default router;