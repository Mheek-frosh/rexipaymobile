import { Platform } from 'react-native';

// Android Emulator: 10.0.2.2 maps to localhost
// iOS Simulator: localhost works
// Physical device: Use your PC's IP (e.g. 192.168.1.5:3001)
const DEFAULT_API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8081' : 'http://localhost:8081';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
