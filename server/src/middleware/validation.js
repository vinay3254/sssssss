// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// OTP validation
export const validateOTP = (otp) => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

// Registration validation middleware
export const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters long' });
  }

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

// Login validation middleware
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  next();
};

// Forgot password validation middleware
export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  next();
};

// OTP verification validation middleware
export const validateOTPVerification = (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (!otp || !validateOTP(otp)) {
    return res.status(400).json({ message: 'Please provide a valid 6-digit OTP' });
  }

  next();
};

// Password reset validation middleware
export const validatePasswordReset = (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (!otp || !validateOTP(otp)) {
    return res.status(400).json({ message: 'Please provide a valid 6-digit OTP' });
  }

  if (!newPassword || !validatePassword(newPassword)) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long' });
  }

  next();
};