import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors({ submit: 'You must be logged in to change password' });
        setLoading(false);
        return;
      }

      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        alert('Password changed successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to change password';
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="panel p-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#F0A500' }}>
            Change Password
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
                required
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                minLength="8"
                required
              />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            {errors.submit && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.submit}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
          
          <div className="mt-6 pt-4 border-t" style={{ borderColor: 'rgba(240,165,0,0.08)' }}>
            <p className="text-xs opacity-75 leading-relaxed">
              By changing your password, you acknowledge and agree to our security and authentication policies. You are responsible for maintaining the confidentiality of your new password.
            </p>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;