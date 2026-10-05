import { Platform } from 'react-native';

// Android Emulator: 10.0.2.2 maps to localhost
// iOS Simulator: localhost works
// Physical device: set EXPO_PUBLIC_API_BASE_URL to your PC's IP (e.g. http://192.168.1.5:3001)
// Port 3001 is the API. Port 8081 is the Expo dev server and will not answer these requests.
const DEFAULT_API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
export const API_REQUEST_TIMEOUT_MS = 8000;

export function apiRequestSignal(ms = API_REQUEST_TIMEOUT_MS) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms);
  }
  return undefined;
}
