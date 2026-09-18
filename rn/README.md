# RexiPay - React Native (Expo)

React Native version of the RexiPay mobile app, built with Expo.

## Expo Go on iPhone

This app targets Expo SDK 57. Use Expo Go for SDK 57 on your iPhone.
After upgrading dependencies, stop any old Expo server and restart from this folder:

```bash
npm install
npx expo start --go --clear
```

Scan the new QR code with your iPhone camera while the phone and computer are on
the same Wi-Fi network. For a tunnel, use `npm run share -- --clear` instead.
Run Expo commands from `rn`; the repository-root start scripts forward here.

To check SDK dependency compatibility, run `npx expo install --check` and
`npx expo-doctor`. Existing development builds must be rebuilt after this SDK upgrade.

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

## EAS Build

- On Windows, local Android builds are not supported with EAS. Use the remote build service instead.

- Login to EAS if you have not already:
  ```bash
  npx eas login
  ```

- Build for Android:
  ```bash
  npm run eas:build:android
  ```

- Build for iOS:
  ```bash
  npm run eas:build:ios
  ```

- Use the preview profile for internal test builds:
  ```bash
  npm run eas:build:preview
  ```

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
