import React, { useState, useEffect } from 'react';

const OTPVerification = ({ email, onVerify, onResend, onCancel }) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6 && !isExpired) {
      onVerify(otp);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
        Enter the 6-digit code sent to {email}
      </p>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Enter 6-digit OTP
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="w-full p-3 text-center text-2xl font-mono border rounded-lg mb-4"
          maxLength={6}
          autoComplete="one-time-code"
        />
        
        <div className="text-center mb-4">
          {isExpired ? (
            <span className="text-red-500">OTP expired</span>
          ) : (
            <span className="text-gray-500">Expires in {formatTime(timeLeft)}</span>
          )}
        </div>
        
        <button
          type="submit"
          disabled={otp.length !== 6 || isExpired}
          className="w-full py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Verify
        </button>
        
        <button
          type="button"
          onClick={onResend}
          className="w-full mt-2 py-2 text-blue-500 hover:underline"
        >
          Resend OTP
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full mt-2 py-2 text-gray-500 hover:underline"
          >
            ← Back to Login
          </button>
        )}
      </form>
    </div>
  );
};

export default OTPVerification;