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

## EAS Update + development build (share URL with anyone who has the build)

This gives you a **shareable URL**. Anyone who has installed your **development build** (Android or iOS) can open that URL to load the latest JS update without reinstalling the app.

### Prerequisites

- [Expo account](https://expo.dev/signup)
- Node.js and npm installed

### Step 1: Install EAS CLI and log in

From the **`rn`** folder:

```bash
npm install -g eas-cli
eas login
```

Use your Expo account email/password.

### Step 2: Configure the project for EAS

If not already done, link the project to EAS (from `rn`):

```bash
eas build:configure
```

Choose the default options if prompted. This creates/updates `eas.json` and ensures `app.json` / `app.config.js` is compatible.

### Step 3: Install expo-updates (for OTA updates)

```bash
npx expo install expo-updates
```

Add the Updates config to `app.json` under `expo` (if not present):

```json
"updates": {
  "url": "https://u.expo.dev/YOUR_PROJECT_ID"
}
```

After your first EAS build, Expo will set `YOUR_PROJECT_ID`; you can also get it from the [Expo dashboard](https://expo.dev) after creating the project.

### Step 4: Create a development build

Build the app that can receive EAS Updates (from `rn`):

**Android (APK for testing):**

```bash
eas build --profile development --platform android
```

**iOS (simulator or device):**

```bash
eas build --profile development --platform ios
```

Wait for the build to finish on Expo’s servers. Download and install the built app:

- **Android**: download the APK from the build page and install on device/emulator, or use the internal distribution link.
- **iOS**: install via the link from the build page (TestFlight or direct link for internal distribution).

Share this **same build** with testers (e.g. APK for Android, TestFlight/internal link for iOS). They only need to install it once.

### Step 5: Publish an update (get the shareable URL)

Whenever you want to ship a new JS/asset bundle to everyone who has the dev build:

From `rn`:

```bash
eas update --branch development --message "Optional short description"
```

EAS will build your JS bundle and publish it. The app (with `expo-updates` and the development client) is already configured to use the **development** branch by default for development builds.

### Step 6: How testers get the update

- **Development build** already points to EAS Updates.
- When they open the app, it will fetch the latest update from the **development** branch (and optionally show a prompt or reload).
- You can also share the **direct update URL** from the Expo dashboard: **Project → Updates → select the update → copy URL**. Anyone with the dev build can use that URL to open the app and load that specific update (e.g. via a custom scheme or in-app link).

### Summary

| Step | Command / action |
|------|-------------------|
| 1 | `npm install -g eas-cli` then `eas login` |
| 2 | `eas build:configure` (in `rn`) |
| 3 | `npx expo install expo-updates` and add `updates.url` in `app.json` |
| 4 | `eas build --profile development --platform android` (or `ios`) → install the build on device |
| 5 | `eas update --branch development --message "Description"` to publish an update |
| 6 | Share the build with testers; they get updates when opening the app (or via the update URL) |

For more: [EAS Update docs](https://docs.expo.dev/eas-update/introduction/) and [Development builds](https://docs.expo.dev/develop/development-builds/introduction/).

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
