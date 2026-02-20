import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const menuItems = [
    {
      id: 'profile',
        label: 'Custom Profile',
        icon: '👤',
        action: () => {
          setIsOpen(false);
          try { navigate('/profile'); } catch (e) { alert('Profile feature coming soon!'); }
        }
    },
    {
      id: 'password',
        label: 'Change Password',
        icon: '🔒',
        action: () => {
          setIsOpen(false);
          try { navigate('/change-password'); } catch (e) { alert('Password change coming soon!'); }
        }
    },
    {
      id: 'wallet',
        label: 'Wallet',
        icon: '💰',
        action: () => {
          setIsOpen(false);
          try { navigate('/wallet'); } catch (e) { alert('Wallet feature coming soon!'); }
        }
    },
    {
      id: 'terms',
        label: 'Terms & Conditions',
        icon: '📋',
        action: () => {
          setIsOpen(false);
          try { navigate('/terms'); } catch (e) { window.open('/terms', '_blank'); }
        }
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button (compact) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-[rgba(240,165,0,0.04)] transition-colors cursor-pointer"
        title="Account Menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300">
          {user?.profilePhoto ? (
            <img 
              src={user.profilePhoto} 
              alt={user?.name || 'Profile'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                const next = e.target.nextElementSibling;
                if (next) next.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-full h-full flex items-center justify-center ${user?.profilePhoto ? 'hidden' : 'flex'}`}
            style={{ background: 'var(--accent-gold)', color: 'var(--primary-dark)', fontWeight: 700 }}
          >
            <span className="text-sm">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu w-72 animate-in slide-in-from-top-2 duration-200" role="menu" aria-label="Account menu">
          {/* Header Section */}
          <div className="px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300">
                {user?.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt={user?.name || 'Profile'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const next = e.target.nextElementSibling;
                      if (next) next.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full flex items-center justify-center ${user?.profilePhoto ? 'hidden' : 'flex'}`}
                  style={{ background: 'var(--accent-gold)', color: 'var(--primary-dark)', fontWeight: 800 }}
                >
                  <span className="text-sm">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-light)' }}>{user?.name || 'Demo User'}</p>
                <p className="text-xs muted truncate">{user?.email || 'demo@example.com'}</p>
              </div>
            </div>

            {/* Wallet summary */}
            <div className="mt-3 flex items-center justify-between px-2 py-2 rounded" style={{ border: '1px solid rgba(240,165,0,0.04)' }}>
              <div>
                <div className="text-xs muted">Wallet Balance</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-light)' }}>{user?.wallet?.balance != null ? `$${user.wallet.balance.toFixed(2)}` : '—'}</div>
              </div>
              <button className="btn-secondary text-sm" onClick={() => { setIsOpen(false); try { navigate('/wallet'); } catch (e) { alert('Open wallet'); } }}>Manage</button>
            </div>
          </div>

          {/* Menu Options */}
          <div className="py-1">
            {menuItems.map((item) => (
              <button key={item.id} onClick={item.action} className="dropdown-item" role="menuitem">
                <span className="text-base mr-2">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Footer Section */}
          <div className="border-t gold-border-light px-4 py-3">
            <button onClick={handleLogout} className="w-full btn-secondary text-red-500">
              <span className="mr-2">🚪</span>Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
