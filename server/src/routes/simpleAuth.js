import express from 'express';
import { forgotPassword, verifyOTP, resetPassword } from '../controllers/simpleAuthController.js';

const router = express.Router();

// Forgot password routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

export default router;