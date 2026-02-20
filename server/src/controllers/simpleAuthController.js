import emailService from '../services/emailService.js';

// In-memory storage for demo (replace with database in production)
const otpStorage = new Map();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email via centralized email service (do NOT log OTPs)
const sendOTPEmail = async (email, otp) => {
  return await emailService.sendOTP(email, otp);
};

// Forgot password - Send OTP
export const forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request received:', req.body);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email configuration missing');
      return res.status(500).json({ message: 'Email service not configured' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in memory (do not expose or log the OTP)
    otpStorage.set(email, { otp, expiresAt });

    // Send OTP via email
    console.log('Attempting to send email...');
    const result = await sendOTPEmail(email, otp);
    console.log('Email sent successfully:', result.messageId);

    res.json({
      message: 'OTP sent successfully to your email address',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      message: 'Failed to send OTP. Please check your email configuration.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otpStorage.get(email);
    
    if (!storedData) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    if (new Date() > storedData.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
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

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const storedData = otpStorage.get(email);
    
    if (!storedData || storedData.otp !== otp || new Date() > storedData.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    otpStorage.delete(email);

    // Send confirmation email
    const confirmationMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'EtherXPPT - Password Reset Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); color: white; padding: 30px; text-align: center;">
            <h1>✅ Password Reset Successful</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; text-align: center; margin: 20px 0;">
              <h3>🎉 Your password has been successfully reset!</h3>
              <p>You can now log in to your EtherXPPT account with your new password.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(confirmationMail);

    res.json({
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};