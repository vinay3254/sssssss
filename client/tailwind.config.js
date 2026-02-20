/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7e6',
          100: '#fdecc0',
          200: '#fbd896',
          300: '#f9c66c',
          400: '#f7b547',
          500: '#f5a623', // Main gold
          600: '#e6951f',
          700: '#cc831b',
          800: '#b37217',
          900: '#995f13',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        surface: {
          light: '#ffffff',
          dark: '#1a1a1a',
          'light-secondary': '#f8fafc',
          'dark-secondary': '#2d2d2d',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(245, 166, 35, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'zoom-in': 'zoomIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(4px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          'from': { transform: 'translateX(-100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          'from': { transform: 'translateY(100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          'from': { transform: 'scale(0.95)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      }
    },
  },
  plugins: [],
}