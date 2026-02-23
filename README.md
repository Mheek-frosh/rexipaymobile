# RexiPay Mobile

A React Native (Expo) mobile payment app with Nigerian bank transfers, OTP auth, and account name resolution.

---

## Quick Start

### 1. Start the backend server (required for OTP & bank resolution)
```bash
cd server
npm install   # first time only
npm start
```

### 2. Run the React Native app
```bash
cd rn
npm install   # first time only
npx expo start
```

### 3. Open on device
Press **`a`** for Android or **`i`** for iOS in the terminal.

---

## Project Structure

```
rexipaymobile/
├── rn/                    ← React Native (Expo) app
│   ├── App.js
│   ├── src/
│   │   ├── config/        # API URL (10.0.2.2:3001 for Android emulator)
│   │   ├── context/       # Auth, Theme
│   │   ├── data/          # Nigerian banks list
│   │   ├── navigation/    # Stack + Bottom tabs
│   │   ├── screens/       # All screens
│   │   ├── services/      # authService, bankService
│   │   └── theme/
│   └── package.json
└── server/                ← Node.js backend
    ├── index.js
    └── .env               # Flutterwave key for bank resolution
```

---

## Features

| Feature | Status |
|---------|--------|
| Login (direct, no OTP) | ✅ |
| Signup → OTP → Personal Info → Success | ✅ |
| Home, Cards, Stats, Profile (tabs) | ✅ |
| Transfer to Bank | ✅ |
| Nigerian banks dropdown | ✅ |
| Account name resolution (Flutterwave API) | ✅ |
| OPay / Lotus Bank support | ✅ |
| Dark / Light theme | ✅ |
| Transactions, Notifications | ✅ |
| Settings, Payment Success | ✅ |

---

## API Config

Edit `rn/src/config/apiConfig.js`:

- **Android Emulator**: `http://10.0.2.2:3001` (default)
- **iOS Simulator**: `http://localhost:3001`
- **Physical device**: `http://YOUR_PC_IP:3001` (e.g. 192.168.1.5)

---

## OPay Account (9034448700)

For OPay accounts, select **"Lotus Bank (OPay)"** or **"OPay"** from the bank dropdown. The server uses your Flutterwave key to resolve the account name.
