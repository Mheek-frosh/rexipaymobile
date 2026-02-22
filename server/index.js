/**
 * RexiPay Auth Server
 * Handles OTP send/verify with Twilio SMS
 * Setup: See CLERK_SETUP.md in project root
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// OTP storage (use Redis in production)
const otpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000;  // 60 seconds

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Convert phone to E.164 format
function toE164(phone, countryCode = '+234') {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return countryCode + cleaned.slice(1);
  }
  if (!cleaned.startsWith(countryCode.replace('+', ''))) {
    return countryCode + cleaned;
  }
  return '+' + cleaned;
}

// Send OTP via Twilio (or log to console if not configured)
async function sendOTP(phoneNumber) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  const otp = generateOTP();
  otpStore.set(phoneNumber, { otp, expiresAt: Date.now() + OTP_EXPIRY_MS, lastSent: Date.now() });

  if (accountSid && authToken && fromNumber) {
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: `Your RexiPay verification code is: ${otp}. Valid for 5 minutes.`,
      from: fromNumber,
      to: phoneNumber,
    });
  } else {
    // Dev mode: log OTP to console
    console.log(`\n📱 OTP for ${phoneNumber}: ${otp}\n`);
  }

  return { success: true };
}

// Verify OTP
function verifyOTP(phoneNumber, code) {
  const stored = otpStore.get(phoneNumber);
  if (!stored) return { success: false, error: 'OTP expired or not found' };
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phoneNumber);
    return { success: false, error: 'OTP has expired' };
  }
  if (stored.otp !== code) {
    return { success: false, error: 'Invalid OTP' };
  }
  otpStore.delete(phoneNumber);
  return { success: true };
}

// Check resend cooldown
function canResend(phoneNumber) {
  const stored = otpStore.get(phoneNumber);
  if (!stored) return true;
  return Date.now() - stored.lastSent >= RESEND_COOLDOWN_MS;
}

function getResendSeconds(phoneNumber) {
  const stored = otpStore.get(phoneNumber);
  if (!stored) return 0;
  const elapsed = (Date.now() - stored.lastSent) / 1000;
  return Math.max(0, Math.ceil(60 - elapsed));
}

// ============ Routes ============

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phone, countryCode = '+234' } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number required' });
    }
    const e164 = toE164(phone, countryCode);
    await sendOTP(e164);
    res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to send OTP' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phone, code, countryCode = '+234', name } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ success: false, error: 'Phone and code required' });
    }
    const e164 = toE164(phone, countryCode);
    const result = verifyOTP(e164, code);
    if (!result.success) {
      return res.status(400).json(result);
    }
    // Return user data (in production, create Clerk user and return session token)
    const [firstName, ...lastParts] = (name || 'User').trim().split(' ');
    res.json({
      success: true,
      user: {
        phone: e164,
        name: name || 'User',
        firstName: firstName || 'User',
        lastName: lastParts.join(' ') || '',
      },
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ success: false, error: err.message || 'Verification failed' });
  }
});

// Resend cooldown status
app.post('/api/auth/resend-status', (req, res) => {
  const { phone, countryCode = '+234' } = req.body;
  const e164 = toE164(phone || '', countryCode);
  res.json({
    canResend: canResend(e164),
    secondsRemaining: getResendSeconds(e164),
  });
});

// Resolve Nigerian bank account name (Flutterwave API)
app.post('/api/bank/resolve-account', async (req, res) => {
  try {
    const { account_number, account_bank } = req.body;
    if (!account_number || !account_bank) {
      return res.status(400).json({ success: false, error: 'Account number and bank code required' });
    }
    const cleanAccount = String(account_number).replace(/\D/g, '');
    if (cleanAccount.length !== 10) {
      return res.status(400).json({ success: false, error: 'Account number must be 10 digits' });
    }

    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      return res.status(503).json({
        success: false,
        error: 'Bank resolution not configured. Add FLUTTERWAVE_SECRET_KEY to .env',
      });
    }

    const fwRes = await fetch('https://api.flutterwave.com/v3/accounts/resolve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        account_number: cleanAccount,
        account_bank: String(account_bank),
      }),
    });

    const fwData = await fwRes.json();
    if (fwData.status === 'success' && fwData.data?.account_name) {
      return res.json({
        success: true,
        account_name: fwData.data.account_name,
      });
    }
    return res.status(400).json({
      success: false,
      error: fwData.message || 'Account not found',
    });
  } catch (err) {
    console.error('Resolve account error:', err);
    res.status(500).json({ success: false, error: err.message || 'Resolution failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`RexiPay Auth Server running on http://localhost:${PORT}`);
  console.log(`  Also accessible at http://192.168.1.5:${PORT} (use your PC's IP for physical device)`);
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.log('⚠️  Twilio not configured - OTPs will be logged to console');
  }
  if (!process.env.FLUTTERWAVE_SECRET_KEY) {
    console.log('⚠️  Flutterwave not configured - bank account resolution disabled');
  }
});
