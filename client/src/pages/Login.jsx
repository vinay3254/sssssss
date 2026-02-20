import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      if (response.data.token) {
        login({
          token: response.data.token,
          email: response.data.user.email,
          name: response.data.user.name,
          id: response.data.user.id
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-white dark:bg-gray-900">
      <div className="max-w-md w-full">
        <div className="panel p-8 flex flex-col justify-center bg-white dark:bg-gray-800">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Logo className="h-12" />
            </div>
            <h2 className="text-2xl font-bold nav-title">Welcome Back</h2>
            <p className="text-neutral-300">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
            <div className="w-full space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input w-full"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input w-full"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center space-y-3">
            <div className="text-center">
              <Link to="/forgot-password" className="font-medium text-sm" style={{ color: 'var(--accent-gold)' }}>
                Forgot your password?
              </Link>
            </div>
              <p className="text-neutral-300">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium" style={{ color: 'var(--accent-gold)' }}>
                Sign up
              </Link>
            </p>
              <Link to="/" className="text-sm muted">
                ← Back to Home
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
