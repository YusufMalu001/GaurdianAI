import Config from '../../constants/config';

const BASE = Config.API_BASE_URL;

export const safetyApi = {
  async getScore(lat: number, lng: number) {
    try {
      const res = await fetch(`${BASE}/safety/score?lat=${lat}&lng=${lng}`);
      return res.json();
    } catch (err) {
      console.warn('Failed to fetch safety score, using fallback:', err);
      return { score: 75, level: 'MEDIUM', timestamp: Date.now() };
    }
  },

  async getIncidents(lat: number, lng: number, radius: number = 500) {
    try {
      const res = await fetch(`${BASE}/safety/incidents?lat=${lat}&lng=${lng}&radius=${radius}`);
      const data = await res.json();
      // Handle both { incidents: [...] } and flat array responses
      return Array.isArray(data) ? data : (Array.isArray(data?.incidents) ? data.incidents : []);
    } catch (err) {
      console.warn('Failed to fetch incidents, returning empty:', err);
      return [];
    }
  },

  async reportIncident(payload: {
    lat: number;
    lng: number;
    type: string;
    description: string;
  }) {
    const res = await fetch(`${BASE}/safety/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
