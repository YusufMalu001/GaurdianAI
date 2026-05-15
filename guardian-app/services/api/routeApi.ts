import Config from '../../constants/config';
import { request } from './http';

const BASE = Config.API_BASE_URL;

export interface PlaceResult {
  display_name: string;
  lat: string;
  lon: string;
}

export interface SafeRouteResponse {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  geometry: {
    coordinates: [number, number][];
    type: 'LineString';
  };
  safetyScore: number;
  estimatedTimeMinutes: number;
  distanceKm: number;
  avoidedDangerZones: number;
  incidentsOnRoute: number;
}

export const routeApi = {
  searchPlaces(query: string) {
    return request<PlaceResult[]>(`${BASE}/routes/search?q=${encodeURIComponent(query)}`);
  },

  getSafeRoute(originLat: number, originLng: number, destLat: number, destLng: number) {
    return request<SafeRouteResponse>(
      `${BASE}/routes/safe?originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}`
    );
  },

  getHeatmap(lat: number, lng: number, radius: number = 2000) {
    return request<{ zones: unknown[]; total: number }>(
      `${BASE}/routes/heatmap?lat=${lat}&lng=${lng}&radius=${radius}`
    );
  },
};
