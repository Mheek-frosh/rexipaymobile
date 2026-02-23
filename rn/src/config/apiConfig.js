import { Platform } from 'react-native';

// Android Emulator: 10.0.2.2 maps to localhost
// iOS Simulator: localhost works
// Physical device: Use your PC's IP (e.g. 192.168.1.5:3001)
export const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
