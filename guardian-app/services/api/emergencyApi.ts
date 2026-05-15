import Config from '../../constants/config';
import { request } from './http';

const BASE = Config.API_BASE_URL;

export interface EmergencyAlert {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  timestamp: number;
  status: string;
}

export const emergencyApi = {
  trigger(userId: string, lat: number, lng: number, token: string) {
    return request<{ message: string; alert: EmergencyAlert }>(`${BASE}/emergency/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, lat, lng, timestamp: Date.now() }),
    });
  },

  cancel(alertId: string, token: string) {
    return request<{ message: string; alert: EmergencyAlert }>(`${BASE}/emergency/cancel/${alertId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  notifyContacts(contactIds: string[], alertId: string, token: string) {
    return request<{ message: string; alertId: string }>(`${BASE}/emergency/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contactIds, alertId }),
    });
  },
};
