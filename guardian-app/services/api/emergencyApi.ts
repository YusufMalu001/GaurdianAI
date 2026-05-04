import Config from '../../constants/config';

const BASE = Config.API_BASE_URL;

export const emergencyApi = {
  async trigger(userId: string, lat: number, lng: number, token: string) {
    const res = await fetch(`${BASE}/emergency/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, lat, lng, timestamp: Date.now() }),
    });
    return res.json();
  },

  async cancel(alertId: string, token: string) {
    const res = await fetch(`${BASE}/emergency/cancel/${alertId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  async notifyContacts(contactIds: string[], alertId: string, token: string) {
    const res = await fetch(`${BASE}/emergency/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contactIds, alertId }),
    });
    return res.json();
  },
};
