import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import transporter from './emailTransporter.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET not set, using fallback (not secure for production)');
  process.env.JWT_SECRET = 'fallback-jwt-secret-change-in-production';
}

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// OTP rate limiting
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { message: 'Too many OTP requests, please try again after 1 hour' }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory storage (replace with database in production)
const users = new Map(); // email -> user data
const otpStorage = new Map(); // email -> otp data
const sessions = new Map(); // token -> user data

// Email transporter is provided by `emailTransporter.js` (verified at startup)

// Utility functions
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Email templates
const createOTPEmail = (otp, email) => ({
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'EtherXPPT - Password Reset OTP',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🔐 Password Reset</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">EtherXPPT</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Hello!</h2>
                  <p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">
                    We received a request to reset your password for your EtherXPPT account. Use the OTP code below to proceed with password reset.
                  </p>
                  
                  <!-- OTP Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0" style="background-color: #f8f9ff; border: 2px dashed #667eea; border-radius: 10px; padding: 30px;">
                          <tr>
                            <td align="center">
                              <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #333333;">Your OTP Code:</p>
                              <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 10px 0;">${otp}</div>
                              <p style="margin: 10px 0 0 0; font-size: 14px; color: #888888;">This code will expire in 10 minutes</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Security Notice -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #856404;">⚠️ Security Notice:</p>
                        <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
                          <li style="margin-bottom: 8px;">Never share this OTP with anyone</li>
                          <li style="margin-bottom: 8px;">EtherXPPT will never ask for your OTP via phone or email</li>
                          <li style="margin-bottom: 8px;">If you didn't request this, please ignore this email</li>
                          <li>This OTP is valid for 10 minutes only</li>
                        </ul>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #666666; margin: 30px 0 0 0; font-size: 16px; line-height: 1.5;">
                    If you have any questions, please contact our support team.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #333333;">Best regards,</p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">The EtherXPPT Team</p>
                  <p style="margin: 0; font-size: 12px; color: #888888;">This is an automated email. Please do not reply to this message.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
});

const createSuccessEmail = (email) => ({
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'EtherXPPT - Password Reset Successful',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">✅ Password Reset Successful</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">EtherXPPT</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 10px; padding: 30px; margin: 20px 0;">
                    <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 22px;">🎉 Your password has been successfully reset!</h3>
                    <p style="color: #155724; margin: 0; font-size: 16px;">You can now log in to your EtherXPPT account with your new password.</p>
                  </div>
                  <p style="color: #666666; margin: 30px 0; font-size: 16px; line-height: 1.5;">
                    For your security, make sure to use a strong, unique password and don't share it with anyone.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = sessions.get(token);
    
    if (!session) {
      return res.status(401).json({ message: 'Invalid session' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'EtherXPPT Production Server',
    version: '2.0.0',
    status: 'healthy',
    features: ['Authentication', 'OTP Verification', 'Password Reset']
  });
});



app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users: users.size,
    activeSessions: sessions.size
  });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    if (users.has(email)) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      isVerified: true
    };

    users.set(email, user);

    // Generate token
    const token = generateToken(email);
    sessions.set(token, { email, loginAt: new Date() });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { name, email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(email);
    sessions.set(token, { email, loginAt: new Date() });

    res.json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Forgot password - Send OTP (works for any email)
app.post('/api/auth/forgot-password', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const attempts = 0;

    // Store OTP (works for any email, not just registered users)
    otpStorage.set(email, { otp, expiresAt, attempts, createdAt: new Date() });

    // Send email
    try {
      const emailOptions = createOTPEmail(otp, email);
      const info = await transporter.sendMail(emailOptions);
      
      console.log(`📧 OTP sent to ${email}`);
      
      res.json({
        message: 'OTP sent successfully to your email address',
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
        expiresIn: '10 minutes'
      });
    } catch (sendErr) {
      console.error('❌ Email send failed:', sendErr);
      res.status(500).json({
        message: 'Failed to send OTP email. Please try again.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to generate OTP. Please try again.' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otpStorage.get(email);

    if (!storedData) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    // Check expiry
    if (new Date() > storedData.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      otpStorage.delete(email);
      return res.status(400).json({ message: 'Too many invalid attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts++;
      return res.status(400).json({ 
        message: 'Invalid OTP',
        attemptsLeft: 3 - storedData.attempts
      });
    }

    // Mark as verified
    storedData.verified = true;

    console.log(`✅ OTP verified for ${email}`);

    res.json({
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// Reset password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const storedData = otpStorage.get(email);

    if (!storedData || !storedData.verified || storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or unverified OTP' });
    }

    if (new Date() > storedData.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password or create new user
    if (users.has(email)) {
      const user = users.get(email);
      user.password = hashedPassword;
      user.updatedAt = new Date();
    } else {
      // Create new user if doesn't exist
      users.set(email, {
        name: email.split('@')[0],
        email,
        password: hashedPassword,
        createdAt: new Date(),
        isVerified: true
      });
    }

    // Clear OTP
    otpStorage.delete(email);

    // Send confirmation email
    const confirmationEmail = createSuccessEmail(email);
    await transporter.sendMail(confirmationEmail);

    console.log(`🔄 Password reset successful for ${email}`);

    res.json({
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const user = users.get(req.user.email);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    sessions.delete(token);
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Presentations API
const presentations = new Map();
app.post('/api/presentations/save', authenticateToken, (req, res) => {
  const { filename, data } = req.body;
  const id = `${req.user.email}_${filename}_${Date.now()}`;
  presentations.set(id, { filename, data, userId: req.user.email, createdAt: new Date() });
  res.json({ success: true, id });
});
app.get('/api/presentations', authenticateToken, (req, res) => {
  const userPresentations = Array.from(presentations.entries())
    .filter(([_, p]) => p.userId === req.user.email)
    .map(([id, p]) => ({ id, filename: p.filename, createdAt: p.createdAt }));
  res.json(userPresentations);
});

// Templates API
const templates = [
  { id: 1, name: 'Business', category: 'business', slides: [{ title: 'Welcome', content: 'Business template' }] },
  { id: 2, name: 'Academic', category: 'education', slides: [{ title: 'Research', content: 'Academic template' }] }
];
app.get('/api/templates', (req, res) => res.json(templates));
app.get('/api/templates/:id', (req, res) => {
  const template = templates.find(t => t.id == req.params.id);
  res.json(template || { error: 'Template not found' });
});

// AI API
app.post('/api/ai/generate-content', authenticateToken, (req, res) => {
  const { prompt, type } = req.body;
  const responses = {
    title: `Generated: ${prompt}`,
    content: `AI content for: ${prompt}`,
    bullet: `• ${prompt}\n• Key point 1\n• Key point 2`
  };
  res.json({ content: responses[type] || responses.content });
});

// Upload API
app.post('/api/upload/image', authenticateToken, (req, res) => {
  res.json({ url: 'data:image/png;base64,mock-image-data', filename: 'uploaded.png' });
});

// Charts API
app.post('/api/charts/generate', authenticateToken, (req, res) => {
  const { type, data } = req.body;
  res.json({ chartId: `chart_${Date.now()}`, config: { type, data } });
});

// Export API
app.post('/api/export/pdf', authenticateToken, (req, res) => {
  setTimeout(() => res.json({ success: true, downloadUrl: '/download/presentation.pdf' }), 1000);
});

// All other APIs
app.use('/api/versions', (req, res) => res.json({ versions: [] }));
app.use('/api/collaboration', (req, res) => res.json({ rooms: [] }));
app.use('/api/search', (req, res) => res.json({ results: [] }));
app.use('/api/animations', (req, res) => res.json({ presets: [] }));
app.use('/api/interactive', (req, res) => res.json({ polls: [] }));
app.use('/api/notes', (req, res) => res.json({ notes: '' }));
app.use('/api/drawing', (req, res) => res.json({ tools: [] }));

app.listen(PORT, () => {
  console.log(`🚀 EtherXPPT Production Server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER || 'NOT CONFIGURED'}`);
  console.log(`🔐 JWT Secret configured: ${!!process.env.JWT_SECRET}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`📧 Test email endpoint: POST /api/test-email`);
});