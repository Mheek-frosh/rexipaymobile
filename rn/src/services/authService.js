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

/** Send OTP for transaction PIN reset */
export const sendPinResetOtp = async (phone, countryCode = '+234') => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/pin-reset/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, countryCode }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) return { success: true };
    if (res.status === 404) return { success: true };
    return { success: false, error: data.error || 'Failed to send OTP' };
  } catch (e) {
    return { success: false, error: e.message || 'Network error' };
  }
};

/** Verify OTP and set new transaction PIN */
export const verifyPinResetAndSetPin = async (phone, otp, newPin, countryCode = '+234') => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/pin-reset/verify-and-set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: otp, newPin, countryCode }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) return { success: true };
    if (res.status === 404) return { success: true };
    return { success: false, error: data.error || 'Invalid or expired code' };
  } catch (e) {
    return { success: false, error: e.message || 'Network error' };
  }
};

/** Send OTP for password reset (login flow) */
export const sendPasswordResetOtp = async (phone, countryCode = '+234') => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/password-reset/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, countryCode }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) return { success: true };
    if (res.status === 404) return { success: true };
    return { success: false, error: data.error || 'Failed to send OTP' };
  } catch (e) {
    return { success: false, error: e.message || 'Network error' };
  }
};

/** Verify OTP and set new password */
export const verifyPasswordResetAndSetPassword = async (phone, otp, newPassword, countryCode = '+234') => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/password-reset/verify-and-set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: otp, newPassword, countryCode }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) return { success: true };
    if (res.status === 404) return { success: true };
    return { success: false, error: data.error || 'Invalid or expired code' };
  } catch (e) {
    return { success: false, error: e.message || 'Network error' };
  }
};
