# RexiPay - React Native (Expo)

React Native version of the RexiPay mobile app, built with Expo.

## Setup

1. Install dependencies:
   ```bash
   cd rn
   npm install
   ```

2. Start the backend server (from project root):
   ```bash
   cd ../server
   npm start
   ```

3. Run the app:
   ```bash
   npx expo start
   ```

4. Press `a` for Android emulator or `i` for iOS simulator.

## Share link (works even if your backend server is down)

To share the app with friends so they can open it in Expo Go:

1. From the `rn` folder run:
   ```bash
   npm run share
   ```
   This starts Expo with **tunnel** mode and gives you a shareable link/QR code.

2. Your friends install **Expo Go** on their phone and scan the QR code (or open the link).

3. The app bundle is served by Expo’s tunnel; the link keeps working as long as you keep `npm run share` running. Your own backend (e.g. `server/`) does not need to be running for the app to load—only API calls that hit your server will fail if it’s down.

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
