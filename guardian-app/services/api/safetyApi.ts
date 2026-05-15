import Config from '../../constants/config';
import { request } from './http';

const BASE = Config.API_BASE_URL;

export interface SafetyScoreResponse {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: number;
  nearbyIncidentCount?: number;
}

export interface Incident {
  id: string;
  userId?: string | null;
  lat: number;
  lng: number;
  type: string;
  description?: string | null;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  verified?: boolean;
}

export const safetyApi = {
  async getScore(lat: number, lng: number) {
    return request<SafetyScoreResponse>(`${BASE}/safety/score?lat=${lat}&lng=${lng}`);
  },

  async getIncidents(lat: number, lng: number, radius: number = 500) {
    return request<Incident[]>(`${BASE}/safety/incidents?lat=${lat}&lng=${lng}&radius=${radius}`);
  },

  async reportIncident(payload: {
    userId?: string;
    lat: number;
    lng: number;
    type: string;
    description: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }) {
    return request<{ message: string; incident: Incident }>(`${BASE}/safety/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
};
