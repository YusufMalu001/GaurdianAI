const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.175.221.252:3001/api';
const wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'ws://10.175.221.252:3001';

export const Config = {
  API_BASE_URL: apiBaseUrl,
  WS_URL: wsUrl,
  SOS_HOLD_DURATION_MS: 3000,
  SAFETY_SCORE_REFRESH_INTERVAL_MS: 30000,
  MAP_DEFAULT_CENTER: { lat: 28.6139, lng: 77.209 },
  MAP_DEFAULT_ZOOM: 15,
  EMERGENCY_CONTACTS_MAX: 5,
  APP_NAME: 'Guardian',
  APP_VERSION: '1.0.0',
};

export default Config;
