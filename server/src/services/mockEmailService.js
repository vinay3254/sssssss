// Mock email service for development
class MockEmailService {
  async sendOTP(email, otp) {
    // Intentionally do not log OTP values. Indicate a mock send without exposing sensitive data.
    console.log(`📧 (mock) Email would be sent to: ${email}`);
    return { success: true, messageId: 'mock-' + Date.now() };
  }

  async sendPasswordReset(email, resetLink) {
    console.log(`🔐 (mock) Password reset would be sent to: ${email}`);
    return { success: true, messageId: 'mock-' + Date.now() };
  }
}

export default new MockEmailService();