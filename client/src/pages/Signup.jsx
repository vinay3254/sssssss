import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import otpService from '../services/otpService';
import Logo from '../components/Logo';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const result = await otpService.sendOTP(formData.email);
      
      if (result.success) {
        setShowOTP(true);
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    const normalizedEmail = formData.email.trim().toLowerCase();
    
    // ✅ Verify against backend instead of localStorage
    const verifyResult = await api.post('/api/auth/verify-otp', {
      email: normalizedEmail,
      otp
    });

    if (verifyResult.data.verified) {
      // OTP verified, now register the user
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const response = await api.post('/api/auth/register', {
        name,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: normalizedEmail,
        password: formData.password
      });
      
      if (response.data.token) {
        login({
          token: response.data.token,
          email: response.data.user.email,
          name: response.data.user.name,
          id: response.data.user.id
        });
        navigate('/dashboard');
      }
    } else {
      setError('Invalid OTP. Please try again.');
    }
  } catch (err) {
    if (err.response?.status === 409) {
      setError('User already exists with this email');
    } else if (err.response?.status === 400) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } else {
      setError('Registration failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

 const handleResendOTP = async () => {
  try {
    // ✅ otpService handles sending + storing on backend
    const result = await otpService.sendOTP(formData.email);
    if (result.success) {
      alert('OTP resent successfully!');
    } else {
      setError('Failed to resend OTP');
    }
  } catch (err) {
    setError('Failed to resend OTP');
  }
};
  if (showOTP) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="panel p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Logo className="h-12" />
              </div>
              <h2 className="text-2xl font-bold nav-title">Verify Email</h2>
              <p className="text-neutral-300">Enter the OTP sent to {formData.email}</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="w-full space-y-6">
              <div>
                <label htmlFor="otp" className="sr-only">OTP</label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setOtp(value);
                  }}
                  className="form-input w-full text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Sign Up'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={handleResendOTP}
                className="text-sm font-medium"
                style={{ color: 'var(--accent-gold)' }}
              >
                Resend OTP
              </button>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowOTP(false)}
                className="font-medium text-sm"
                style={{ color: 'var(--accent-gold)' }}
              >
                ← Back to Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="panel p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Logo className="h-12" />
            </div>
            <h2 className="text-2xl font-bold nav-title">Create Account</h2>
            <p className="text-neutral-300">Join thousands of users creating amazing presentations</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSendOTP} className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input w-full"
                  placeholder="First Name"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input w-full"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="signupEmail" className="sr-only">Email Address</label>
              <input
                id="signupEmail"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input w-full"
                placeholder="Email Address"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="signupPassword" className="sr-only">Password</label>
              <input
                id="signupPassword"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input w-full"
                placeholder="Password"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input w-full"
                placeholder="Confirm Password"
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Sign Up with OTP'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium" style={{ color: 'var(--accent-gold)' }}>
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
