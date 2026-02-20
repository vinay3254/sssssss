import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePresentation } from '../contexts/PresentationContext';
import { RiFileAddLine, RiStarLine, RiHistoryLine } from 'react-icons/ri';
import Logo from '../components/Logo';

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { getUserHistory, getUserFavorites } = usePresentation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black sticky top-0 z-50">
        <div className="px-3 py-3 flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex items-center flex-shrink-0 min-w-[50px]">
            <Logo className="h-8" />
          </div>
          
          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">Home</Link>
            <a href="#features" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">Features</a>
          </nav>
          
          {/* Auth buttons - Right Corner */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg transition-all duration-200 border flex items-center justify-center flex-shrink-0"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
              }}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark ? (
                <svg className="w-4 h-4 text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <Link 
              to="/login" 
              className="btn-secondary cursor-pointer px-3 py-1.5 text-xs font-medium flex-shrink-0 whitespace-nowrap"
              onClick={() => {
                localStorage.setItem('authFlow', 'login');
              }}
              style={{ pointerEvents: 'auto' }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => {
                localStorage.setItem('authFlow', 'signin');
              }}
              className="btn-secondary cursor-pointer px-3 py-1.5 text-xs font-medium flex-shrink-0 whitespace-nowrap"
              style={{ pointerEvents: 'auto' }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn" style={{ color: '#F0A500' }}>
            Create Amazing
            <span className={isDark ? 'text-white' : 'text-gray-900'}> Presentations</span>
          </h1>
          <p className={`text-xl mb-8 animate-slideInUp ${isDark ? 'text-white' : 'text-gray-700'}`}>
            Professional PowerPoint-like editor with real-time collaboration, 
            modern design tools, and seamless workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            <Link 
              to="/signup" 
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center cursor-pointer min-w-[180px] h-[48px]"
              style={{ pointerEvents: 'auto' }}
            >
              Get Started Free
            </Link>
            <button 
              onClick={() => {
                localStorage.setItem('authFlow', 'demo');
                navigate('/dashboard');
              }}
              className="btn-secondary text-lg px-8 py-3 flex items-center justify-center cursor-pointer min-w-[180px] h-[48px]"
              style={{ pointerEvents: 'auto' }}
            >
              Try Demo
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-20">
          <button
            onClick={() => navigate('/dashboard')}
            className="panel p-6 text-center animate-slideInLeft hover:shadow-glow transition cursor-pointer bg-white dark:bg-gray-800"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="w-12 h-12 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border border-yellow-500">
              <RiFileAddLine className="text-2xl text-yellow-500" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>New Presentation</h3>
            <p className={isDark ? 'text-white' : 'text-gray-600'}>Create and open a new presentation instantly.</p>
          </button>
          
          <button
            onClick={() => {
              if (user) {
                const favorites = getUserFavorites();
                if (favorites.length > 0) {
                  navigate('/home?view=favourites');
                } else {
                  alert('No favorites yet. Star some presentations!');
                }
              } else {
                navigate('/login');
              }
            }}
            className="panel p-6 text-center animate-slideInLeft hover:shadow-glow transition cursor-pointer bg-white dark:bg-gray-800"
            title={user ? 'View your favourites' : 'Login to access favourites'}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="w-12 h-12 bg-transparent rounded-lg mx-auto mb-4 flex items-center justify-center">
              <RiStarLine className="text-2xl" style={{ color: '#F0A500' }} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Favourites</h3>
            <p className={isDark ? 'text-white' : 'text-gray-600'}>{user ? 'Your starred presentations.' : 'Sign in to access favourites.'}</p>
          </button>
          
          <button
            onClick={() => {
              if (user) {
                const history = getUserHistory();
                if (history.length > 0) {
                  navigate('/home?view=history');
                } else {
                  alert('No history yet. Start creating presentations!');
                }
              } else {
                navigate('/login');
              }
            }}
            className="panel p-6 text-center animate-slideInLeft hover:shadow-glow transition cursor-pointer bg-white dark:bg-gray-800"
            title={user ? 'View your history' : 'Login to access history'}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="w-12 h-12 bg-transparent rounded-lg mx-auto mb-4 flex items-center justify-center">
              <RiHistoryLine className="text-2xl" style={{ color: '#F0A500' }} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>History</h3>
            <p className={isDark ? 'text-white' : 'text-gray-600'}>{user ? 'Recently worked on presentations.' : 'Sign in to access history.'}</p>
          </button>
        </div>


        {/* Simplified UI: remove cluttered features */}
        <div className="mt-20 text-center"></div>
      </main>

      {/* Footer */}
      <footer className="py-12 mt-20">
        <div className={`container mx-auto px-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <div className="flex items-center justify-center space-x-1 mb-4">
            <img src="/DOCS-LOGO-final-transparent.png" alt="Logo" className="w-12 h-12" />
            <span className="text-2xl font-bold nav-title">EtherXPPT</span>
          </div>
          <p className="mb-4">Professional presentation software for modern teams</p>
          <div className="flex justify-center space-x-6">
            <Link to="/login" className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'}`}>Login</Link>
            <Link to="/signup" className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'}`}>Sign Up</Link>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Landing;