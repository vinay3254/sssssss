import React, { createContext, useContext, useState, useEffect } from 'react';

// Dark + Gold theme variables
const DARK_GOLD_VARS = {
  '--primary-dark': '#1B1A17',
  '--accent-gold': '#F0A500',
  '--text-light': '#FFFFFF',
  '--gold-hover': '#d48f00'
};

const applyVars = (vars) => {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // Check system preference if no saved preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen for system theme changes when no manual preference is saved
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (!saved) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
      applyVars(DARK_GOLD_VARS);
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      // Remove dark theme variables
      Object.keys(DARK_GOLD_VARS).forEach(key => root.style.removeProperty(key));
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};