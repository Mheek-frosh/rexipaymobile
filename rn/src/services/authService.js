import { API_BASE_URL } from '../config/apiConfig';

export const sendOtp = async (phone, countryCode = '+234') => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, countryCode }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true };
    }
    return { success: false, error: data.error || 'Failed to send OTP' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
};

export const verifyOtp = async (phone, code, countryCode = '+234', name) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code, countryCode, name }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error || 'Verification failed' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
};

export const getResendStatus = async (phone, countryCode = '+234') => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/resend-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, countryCode }),
    });
    const data = await res.json();
    return {
      canResend: data.canResend ?? true,
      secondsRemaining: data.secondsRemaining ?? 0,
    };
  } catch (_) {
    return { canResend: true, secondsRemaining: 0 };
  }
};
