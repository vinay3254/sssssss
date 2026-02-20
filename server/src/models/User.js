import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  presentations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presentation'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordOTP: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  otpAttempts: {
    type: Number,
    default: 0
  },
  lastOTPRequest: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP method
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetPasswordOTP = otp;
  this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  this.lastOTPRequest = new Date();
  return otp;
};

// Verify OTP method
userSchema.methods.verifyOTP = function(otp) {
  if (!this.resetPasswordOTP || !this.resetPasswordExpires) {
    return false;
  }
  
  if (new Date() > this.resetPasswordExpires) {
    return false;
  }
  
  return this.resetPasswordOTP === String(otp); // ✅ safe string comparison
};

// Clear OTP method
userSchema.methods.clearOTP = function() {
  this.resetPasswordOTP = null;
  this.resetPasswordExpires = null;
  this.otpAttempts = 0;
};

export default mongoose.model('User', userSchema);