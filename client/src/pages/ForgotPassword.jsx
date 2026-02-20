import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import otpService from '../services/otpService';
import api from '../utils/api';
import Logo from '../components/Logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'otp', 'reset', 'success'

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await otpService.sendOTP(email);
      if (result.success) {
        setStep('otp');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api.post('/api/auth/verify-otp', { email, otp });
      if (result.data.verified) {
        setStep('reset');
      } else {
        setError('Invalid OTP');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/reset-password', { email, otp, newPassword });
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await otpService.sendOTP(email);
      if (result.success) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      } else {
        setError('Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--primary-dark)' }}>
      <div className="max-w-md w-full">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Logo className="h-12" />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>Reset Password</h2>
            <p className="muted">Enter your email to receive reset instructions</p>
          </div>

          {/* Success Popup */}
          {showPopup && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>OTP sent to your email!</span>
              </div>
            </div>
          )}

          {/* Success/Info Message */}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {step === 'success' ? (
            <div className="text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Password reset successfully! You can now login with your new password.
              </div>
              <Link to="/login" className="btn-primary inline-block px-6 py-2 rounded">
                Go to Login
              </Link>
            </div>
          ) : step === 'reset' ? (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  minLength="6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  minLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || newPassword !== confirmPassword}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : step === 'otp' ? (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setOtp(value);
                  }}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                className="w-full btn-secondary py-2 text-sm"
              >
                Resend OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>
          )}

          {step !== 'success' && (
            <div className="mt-6 text-center">
              <Link to="/login" className="text-blue-400 hover:text-blue-300">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
