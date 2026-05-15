export interface RiskIncident {
  lat: number;
  lng: number;
  riskLevel: string;
}

const EARTH_RADIUS_KM = 6371;

const toRadians = (value: number) => (value * Math.PI) / 180;

export function haversineDistanceKm(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
) {
  const dLat = toRadians(endLat - startLat);
  const dLng = toRadians(endLng - startLng);
  const lat1 = toRadians(startLat);
  const lat2 = toRadians(endLat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function riskWeight(level: string) {
  switch (level) {
    case 'CRITICAL':
      return 20;
    case 'HIGH':
      return 12;
    case 'MEDIUM':
      return 7;
    default:
      return 3;
  }
}

export function calculateSafetyScore(lat: number, lng: number, incidents: RiskIncident[]) {
  const isNight = new Date().getHours() < 6 || new Date().getHours() > 21;
  const nearbyIncidents = incidents.filter(
    (incident) => haversineDistanceKm(lat, lng, incident.lat, incident.lng) <= 2
  );

  const penalty = nearbyIncidents.reduce((total, incident) => total + riskWeight(incident.riskLevel), 0);
  const score = Math.max(20, Math.min(100, 92 - penalty - (isNight ? 10 : 0)));

  return {
    score,
    level: score >= 80 ? 'LOW' : score >= 60 ? 'MEDIUM' : score >= 40 ? 'HIGH' : 'CRITICAL',
    nearbyIncidents,
  };
}
