import Config from '../../constants/config';

const BASE = Config.API_BASE_URL;

export const routeApi = {
  async getSafeRoute(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ) {
    const res = await fetch(
      `${BASE}/routes/safe?originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}`
    );
    return res.json();
  },

  async getHeatmap(lat: number, lng: number, radius: number = 2000) {
    const res = await fetch(`${BASE}/routes/heatmap?lat=${lat}&lng=${lng}&radius=${radius}`);
    return res.json();
  },
};
