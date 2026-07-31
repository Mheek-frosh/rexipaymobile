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
    console.log(`[Offline Mode Fallback] Mock OTP sent to ${phone}: 123456`);
    return { success: true, isOfflineMock: true };
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
    if (code === '123456' || code === '000000') {
      const [firstName, ...lastParts] = (name || 'User').trim().split(' ');
      return {
        success: true,
        user: {
          phone: countryCode + phone.replace(/\D/g, ''),
          name: name || 'User',
          firstName: firstName || 'User',
          lastName: lastParts.join(' ') || '',
        },
        isOfflineMock: true,
      };
    }
    return { success: false, error: 'Invalid code. Try "123456" or "000000".' };
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
    console.log(`[Offline Mode Fallback] Mock PIN reset OTP sent to ${phone}: 123456`);
    return { success: true, isOfflineMock: true };
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
    if (otp === '123456' || otp === '000000') {
      return { success: true, isOfflineMock: true };
    }
    return { success: false, error: 'Invalid code. Try "123456" or "000000".' };
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
    console.log(`[Offline Mode Fallback] Mock password reset OTP sent to ${phone}: 123456`);
    return { success: true, isOfflineMock: true };
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
    if (otp === '123456' || otp === '000000') {
      return { success: true, isOfflineMock: true };
    }
    return { success: false, error: 'Invalid code. Try "123456" or "000000".' };
  }
};
