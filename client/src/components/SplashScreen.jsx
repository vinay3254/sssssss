import React, { useState, useEffect } from 'react';

export function SplashScreen({ onLoadingComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="splash-screen" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1B1A17 0%, #000000 50%, #1B1A17 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      transition: 'opacity 0.8s ease',
      opacity: isVisible ? 1 : 0,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#F0A500'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px'
      }}>
        <div style={{
          width: '180px',
          height: '180px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '25px',
          overflow: 'hidden',
          boxShadow: '0 0 25px rgba(240, 165, 0, 0.5)',
          background: 'transparent'
        }}>
          <img
            src="/DOCS-LOGO-final-transparent.png"
            alt="EtherX Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '25px'
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}>
          <div style={{
            fontSize: '52px',
            fontWeight: 700,
            background: 'linear-gradient(to right, #F0A500, #fff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 20px rgba(240, 165, 0, 0.6)',
            animation: 'textGlow 3s ease-in-out infinite alternate'
          }}>
            EtherX PPT
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.75)',
            marginTop: '5px',
            letterSpacing: '3px'
          }}>
            PRESENTATION EXCELLENCE
          </div>
        </div>
      </div>
      <div style={{
        width: '300px',
        height: '4px',
        background: 'rgba(240, 165, 0, 0.2)',
        borderRadius: '4px',
        marginTop: '50px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: '0%',
          background: 'linear-gradient(to right, #F0A500, #ffd271)',
          borderRadius: '4px',
          animation: 'loading 3s ease forwards'
        }} />
      </div>
      <style>{`
        @keyframes textGlow {
          0% {
            text-shadow: 0 0 10px rgba(240, 165, 0, 0.4), 0 0 20px rgba(240, 165, 0, 0.2);
          }
          100% {
            text-shadow: 0 0 20px rgba(240, 165, 0, 0.8), 0 0 35px rgba(240, 165, 0, 0.5);
          }
        }
        @keyframes loading {
          0% { width: 0%; }
          70% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;