import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import emailService from '../services/emailService.js';
import bcrypt from 'bcryptjs';

console.log("🔴🔴🔴 AUTH CONTROLLER FILE LOADED 🔴🔴🔴");




// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured. Please use production server.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔵 Login attempt for:", email);

    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured. Please use production server.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("📦 Stored password hash:", user.password);

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    console.log("🔐 Password valid:", isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Forgot password - Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // Check rate limiting (max 3 requests per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (user.lastOTPRequest && user.lastOTPRequest > oneHourAgo && user.otpAttempts >= 3) {
      return res.status(429).json({ 
        message: 'Too many OTP requests. Please try again after 1 hour.' 
      });
    }

    // Generate OTP
    const otp = user.generateOTP();
    user.otpAttempts = (user.otpAttempts || 0) + 1;
    await user.save();

    // Send OTP via email
    const emailResult = await emailService.sendOTP(email, otp, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({
      message: 'OTP sent successfully to your email address',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email for security
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    const isOTPValid = user.verifyOTP(otp);
    if (!isOTPValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
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
  console.log("🔵 RESET PASSWORD FUNCTION CALLED");
  
  try {
    const { email, otp, newPassword } = req.body;
    console.log("✅ Password reset for:", email);
    console.log("📝 Request body received:", { email, otp: otp ? "***" : undefined, newPassword: newPassword ? "***" : undefined });

    // Find user by email
    console.log("🔍 Step 1: Finding user...");
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("✅ User found:", user.email);
    console.log("📦 OLD password hash:", user.password);

    // Verify OTP one more time
    console.log("🔍 Step 2: Verifying OTP...");
    const isOTPValid = user.verifyOTP(otp);
    
    if (!isOTPValid) {
      console.log("❌ OTP verification failed");
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    console.log("✅ OTP verified successfully");

    // MANUALLY HASH THE PASSWORD
    console.log("🔍 Step 3: Hashing password...");
    const salt = await bcrypt.genSalt(12);
    console.log("✅ Salt generated");
    
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log("✅ Password hashed");
    console.log("🔐 Manually hashed password:", hashedPassword);

    // Update directly in database
    console.log("🔍 Step 4: Updating database...");
    const updateResult = await User.findOneAndUpdate(
      { email },
      { 
        password: hashedPassword,
        resetPasswordOTP: null,
        resetPasswordExpires: null,
        otpAttempts: 0
      }
    );
    console.log("✅ Database update completed", updateResult ? "successfully" : "but returned null");

    // Verify it saved
    console.log("🔍 Step 5: Verifying save...");
    const updatedUser = await User.findOne({ email });
    console.log("📦 VERIFIED from DB:", updatedUser.password);
    
    // Test the password
    console.log("🔍 Step 6: Testing password...");
    const testPassword = await bcrypt.compare(newPassword, updatedUser.password);
    console.log("✅ Password test:", testPassword ? "✅ PASS" : "❌ FAIL");

    // Send confirmation email
    console.log("🔍 Step 7: Sending confirmation email...");
    await emailService.sendPasswordResetConfirmation(email, user.name);
    console.log("✅ Confirmation email sent");

    console.log("🎉 PASSWORD RESET COMPLETED SUCCESSFULLY");
    
    res.json({
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('❌❌❌ PASSWORD RESET ERROR:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -resetPasswordOTP -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};