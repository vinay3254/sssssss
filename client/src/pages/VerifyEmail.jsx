import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        login(data.token, data.user);
        navigate('/home');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        alert('New OTP sent to your email');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--primary-dark)' }}>
      <div className="max-w-md w-full">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src="/src/assets/icons/DOCS-LOGO-final-transparent.png" alt="Logo" className="w-10 h-10" />
              <span className="text-3xl font-bold" style={{ color: 'var(--accent-gold)' }}>EtherXPPT</span>
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>Verify Your Email</h2>
            <p className="muted">
              We've sent a 6-digit code to<br />
              <span className="font-semibold">{email}</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-blue-400 hover:text-blue-300 font-semibold disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/signup" className="text-blue-400 hover:text-blue-300">
              Back to Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;