export const Config = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.9:3001/api',
  WS_URL: process.env.EXPO_PUBLIC_WS_URL || 'ws://192.168.1.9:3001',
  SOS_HOLD_DURATION_MS: 3000,
  SAFETY_SCORE_REFRESH_INTERVAL_MS: 30000,
  MAP_DEFAULT_CENTER: { lat: 28.6139, lng: 77.209 }, // New Delhi
  MAP_DEFAULT_ZOOM: 15,
  EMERGENCY_CONTACTS_MAX: 5,
  APP_NAME: 'Guardian',
  APP_VERSION: '1.0.0',
};

export default Config;
