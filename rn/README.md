# RexiPay - React Native (Expo)

React Native version of the RexiPay mobile app, built with Expo.

## Setup

1. Install dependencies:
   ```bash
   cd rn
   npm install
   ```

2. (Optional) Start the backend server (from project root):
   ```bash
   cd ../server
   npm start
   ```

3. Run the app (from `rn`):
   ```bash
   npm run dev
   ```

4. Scan the QR code with **Expo Go** on your phone (same Wi‑Fi), or press `a` for Android / `i` for iOS simulator.

## API Configuration

- **Android Emulator**: Uses `http://10.0.2.2:3001` (localhost from emulator)
- **iOS Simulator**: Uses `http://localhost:3001`
- **Physical device**: Update `src/config/apiConfig.js` with your PC's IP (e.g. `http://192.168.1.5:3001`)

## Features

- **Auth**: Signup (OTP), Login (direct), Personal Info, Account Success
- **Main**: Home, Cards, Stats, Profile (bottom tabs)
- **Transfer**: Nigerian banks, account resolution when 10 digits entered
- **Theme**: Primary #2E63F6, dark/light mode
- **Server**: Same API as Flutter app (`../server`)
