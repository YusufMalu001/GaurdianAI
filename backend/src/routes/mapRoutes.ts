import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { haversineDistanceKm, riskWeight } from '../lib/geo.js';

const router = Router();

interface PlaceSearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface IncidentRecord {
  id: string;
  lat: number;
  lng: number;
  type: string;
  description: string | null;
  riskLevel: string;
  reportedAt: Date;
}

interface OsrmRouteResponse {
  routes?: Array<{
    distance: number;
    duration: number;
    geometry: {
      coordinates: Array<[number, number]>;
      type: 'LineString';
    };
  }>;
}

router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = String(req.query.q ?? '').trim();
    if (query.length < 3) {
      return res.json([]);
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'GuardianBackend/1.0',
        },
      }
    );

    if (!response.ok) {
      const message = await response.text();
      return res.status(502).json({ error: 'Place search failed', details: message.slice(0, 200) });
    }

    const data = (await response.json()) as PlaceSearchResult[];
    return res.json(data);
  } catch (error) {
    console.error('[ROUTES] Search failed:', error);
    return res.status(500).json({ error: 'Failed to search places' });
  }
});

router.get('/safe', async (req: Request, res: Response) => {
  try {
    const originLat = Number(req.query.originLat);
    const originLng = Number(req.query.originLng);
    const destLat = Number(req.query.destLat);
    const destLng = Number(req.query.destLng);

    if ([originLat, originLng, destLat, destLng].some((value) => Number.isNaN(value))) {
      return res.status(400).json({ error: 'originLat, originLng, destLat, and destLng are required' });
    }

    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`,
      {
        headers: { Accept: 'application/json' },
      }
    );

    if (!response.ok) {
      const message = await response.text();
      return res.status(502).json({ error: 'Route lookup failed', details: message.slice(0, 200) });
    }

    const data = (await response.json()) as OsrmRouteResponse;
    const route = data.routes?.[0];
    if (!route) {
      return res.status(404).json({ error: 'No route found' });
    }

    const incidents = (await prisma.incident.findMany({
      orderBy: { reportedAt: 'desc' },
      take: 250,
    })) as IncidentRecord[];

    const routeIncidents = incidents.filter((incident: IncidentRecord) =>
      route.geometry.coordinates.some(([lng, lat]: [number, number]) =>
        haversineDistanceKm(lat, lng, incident.lat, incident.lng) <= 0.25
      )
    );

    const penalty = routeIncidents.reduce(
      (total: number, incident: IncidentRecord) => total + riskWeight(incident.riskLevel),
      0
    );
    const safetyScore = Math.max(25, Math.min(100, 95 - penalty));
    const highRiskCount = routeIncidents.filter((incident: IncidentRecord) =>
      incident.riskLevel === 'HIGH' || incident.riskLevel === 'CRITICAL'
    ).length;

    return res.json({
      origin: { lat: originLat, lng: originLng },
      destination: { lat: destLat, lng: destLng },
      geometry: route.geometry,
      safetyScore,
      estimatedTimeMinutes: Math.round(route.duration / 60),
      distanceKm: Number((route.distance / 1000).toFixed(1)),
      avoidedDangerZones: highRiskCount,
      incidentsOnRoute: routeIncidents.length,
    });
  } catch (error) {
    console.error('[ROUTES] Safe route lookup failed:', error);
    return res.status(500).json({ error: 'Failed to fetch safe route' });
  }
});

router.get('/heatmap', async (req: Request, res: Response) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = Number(req.query.radius ?? 2) / 1000;

    const incidents = (await prisma.incident.findMany({
      orderBy: { reportedAt: 'desc' },
      take: 250,
    })) as IncidentRecord[];

    const filtered = Number.isNaN(lat) || Number.isNaN(lng)
      ? incidents
      : incidents.filter((incident: IncidentRecord) => haversineDistanceKm(lat, lng, incident.lat, incident.lng) <= radiusKm);

    const zones = filtered.map((incident: IncidentRecord) => ({
      id: incident.id,
      lat: incident.lat,
      lng: incident.lng,
      risk: incident.riskLevel,
      color:
        incident.riskLevel === 'CRITICAL' || incident.riskLevel === 'HIGH'
          ? '#FF3B3B'
          : incident.riskLevel === 'MEDIUM'
            ? '#FFB800'
            : '#00E5C3',
      radius: incident.riskLevel === 'CRITICAL' ? 360 : incident.riskLevel === 'HIGH' ? 280 : 180,
      description: incident.description,
      type: incident.type,
      timestamp: incident.reportedAt.toISOString(),
    }));

    return res.json({ zones, total: zones.length });
  } catch (error) {
    console.error('[ROUTES] Heatmap lookup failed:', error);
    return res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
});

export default router;
