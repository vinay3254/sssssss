import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PresentationProvider } from './contexts/PresentationContext';
import { CollaborationProvider } from './contexts/CollaborationContext';
import { CloudProvider } from './contexts/CloudContext';
import SplashScreen from './components/SplashScreen';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import Wallet from './pages/Wallet';
import Terms from './pages/Terms';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <ThemeProvider>
          <CollaborationProvider>
            <CloudProvider>
              <PresentationProvider>
                {showSplash && <SplashScreen onLoadingComplete={handleLoadingComplete} />}
                
                {!showSplash && (
                  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/verify-email" element={<VerifyEmail />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route 
                        path="/home" 
                        element={
                          <ProtectedRoute>
                            <Home />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/change-password"
                        element={
                          <ProtectedRoute>
                            <ChangePassword />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/wallet"
                        element={
                          <ProtectedRoute>
                            <Wallet />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/terms" element={<Terms />} />
                    </Routes>
                  </Router>
                )}
              </PresentationProvider>
            </CloudProvider>
          </CollaborationProvider>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;