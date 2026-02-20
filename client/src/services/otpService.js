import emailjs from '@emailjs/browser';
import api from '../utils/api';

// Initialize EmailJS with public key
emailjs.init('TYkpV87eFwcA3xSTa');

class OTPService {
  // EmailJS configuration
  SERVICE_ID = 'service_dlh7slg';
  TEMPLATE_ID = 'template_w1qdy78';
  PUBLIC_KEY = 'l_EZN2hYukjwIiuYK';

   generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(email) {
  // ✅ Generate ONE otp at the top
  const otp = this.generateOTP();

  try {
    await emailjs.send(
      this.SERVICE_ID,
      this.TEMPLATE_ID,
      {
        email: email,
        passcode: otp,
        time: "10 minutes"
      },
      this.PUBLIC_KEY
    );

    console.log('📧 OTP sent via EmailJS to:', email);

    // ✅ Store the SAME otp that was emailed
    await api.post('/api/auth/store-otp', {
      email: email.trim().toLowerCase(),
      otp
    });

    console.log('💾 OTP stored on backend');
    return { success: true, message: 'OTP sent successfully to your email' };

  } catch (err) {
    console.error('EmailJS send error', err);

    // ✅ Still store the SAME otp (no new generateOTP call!)
    await api.post('/api/auth/store-otp', {
      email: email.trim().toLowerCase(),
      otp
    });

    console.log(`
========================================
📧 DEVELOPMENT MODE - OTP for ${email}: ${otp}
========================================
`);

    return { success: true, message: 'OTP sent (check console in dev mode)', devMode: true };
  }
}
  

  // Keep verifyOTP but it's no longer used for password reset
  async verifyOTP(otp, email) {
    try {
      const storedOTP = localStorage.getItem(`otp_${email}`);
      const expiresAt = localStorage.getItem(`otp_expires_${email}`);
      
      if (!storedOTP || !expiresAt) {
        return { valid: false, message: 'OTP expired or not requested' };
      }
      
      if (Date.now() > parseInt(expiresAt)) {
        localStorage.removeItem(`otp_${email}`);
        localStorage.removeItem(`otp_expires_${email}`);
        return { valid: false, message: 'OTP expired' };
      }
      
      if (storedOTP === otp) {
        localStorage.removeItem(`otp_${email}`);
        localStorage.removeItem(`otp_expires_${email}`);
        return { valid: true, message: 'OTP verified successfully' };
      }
      
      return { valid: false, message: 'Invalid OTP' };
    } catch (err) {
      console.error('verifyOTP error', err);
      return { valid: false, message: 'Verification failed' };
    }
  }
}


export default new OTPService();
