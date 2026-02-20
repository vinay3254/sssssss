import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.name || '',
    email: user?.email || '',
    profilePicture: user?.profilePhoto || null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: event.target.result
        }));
      };
      reader.onerror = () => {
        console.error('Failed to read file');
        alert('Failed to read image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // Update user data
      login({
        ...user,
        name: profileData.displayName,
        email: profileData.email,
        profilePhoto: profileData.profilePicture
      });
      
      alert('Profile updated successfully!');
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="panel p-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#F0A500' }}>
            Custom Profile
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="text-center">
              <div className="mb-4">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div 
                    className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-medium"
                    style={{ backgroundColor: '#F0A500' }}
                  >
                    {(profileData.displayName || profileData.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div>
                <label className="btn-secondary cursor-pointer">
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                value={profileData.displayName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your display name"
                required
              />
            </div>
            
            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
          
          <div className="mt-6 pt-4 border-t" style={{ borderColor: 'rgba(240,165,0,0.08)' }}>
            <p className="text-xs opacity-75 leading-relaxed">
              By customizing your profile, you agree that your display name and profile picture may be visible in accordance with our privacy standards. You confirm that you have the right to use any image you upload.
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

export default Profile;