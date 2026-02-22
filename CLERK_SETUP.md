# RexiPay Auth Setup Guide

Step-by-step instructions to get OTP authentication working with the RexiPay app.

---

## Overview

The auth flow uses:
- **Backend server** (Node.js) – sends OTP via Twilio SMS
- **Flutter app** – calls the backend, shows snackbar when OTP is sent, countdown for resend

---

## Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

---

## Step 2: Configure Twilio (for real SMS)

1. Create a [Twilio account](https://www.twilio.com/try-twilio) (free trial available).
2. In the [Twilio Console](https://console.twilio.com/):
   - Copy **Account SID**
   - Copy **Auth Token**
   - Get a **Phone Number** (Phone Numbers → Manage → Buy a number)
3. Create a `.env` file in the `server` folder:

```env
PORT=3001
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Step 3: Run the Backend (without Twilio for dev)

If you skip Twilio, OTPs are printed in the server console.

```bash
cd server
npm start
```

You should see:
```
RexiPay Auth Server running on http://localhost:3001
⚠️  Twilio not configured - OTPs will be logged to console
```

---

## Step 4: Configure Flutter API URL

Edit `lib/config/api_config.dart`:

- **Android Emulator**: `http://10.0.2.2:3001` (default)
- **iOS Simulator**: `http://localhost:3001`
- **Physical device**: `http://YOUR_PC_IP:3001` (e.g. `http://192.168.1.5:3001`)

---

## Step 5: Run the Flutter App

```bash
flutter pub get
flutter run
```

---

## Auth Flow

### Signup
1. Enter name + phone → tap **Sign up**
2. Confirm phone in dialog → tap **Yes**
3. OTP is sent → snackbar: "OTP Sent"
4. Enter 6-digit code → tap **Verify Number**
5. Success → continue to Personal Info

### Login
1. Enter phone → tap **Send OTP**
2. OTP is sent → snackbar: "OTP Sent"
3. Enter 6-digit code → tap **Verify Number**
4. Success → go to Home

### Resend
- 60-second countdown after sending OTP
- After countdown, tap **Resend** to send again

---

## Optional: Clerk Integration

To add Clerk for user management:

1. Create a [Clerk account](https://dashboard.clerk.com/).
2. Create an application and enable **Phone** in User & Authentication.
3. Add Twilio in Clerk Dashboard (Configure → SMS).
4. Install Clerk in the server:

```bash
cd server
npm install @clerk/clerk-sdk-node
```

5. Add `CLERK_SECRET_KEY` to `.env` and use it in the server to create users after OTP verification.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection refused" | Ensure the server is running on port 3001 |
| OTP not received | Check Twilio credentials; without Twilio, check server console for the OTP |
| Android can't reach server | Use `10.0.2.2` instead of `localhost` |
| Physical device can't reach server | Use your computer's local IP in `api_config.dart` |
