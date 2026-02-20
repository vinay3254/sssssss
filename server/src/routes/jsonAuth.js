import express from 'express';
import { register, login, getProfile, forgotPassword, verifyOTP, resetPassword, verifyEmail, resendVerification } from '../controllers/jsonAuthController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticateToken, getProfile);

export default router;