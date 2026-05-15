import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { calculateSafetyScore, haversineDistanceKm } from '../lib/geo.js';

const router = Router();

interface IncidentRecord {
  id: string;
  userId: string | null;
  lat: number;
  lng: number;
  type: string;
  description: string | null;
  riskLevel: string;
  reportedAt: Date;
  verified: boolean;
}

router.get('/score', async (req: Request, res: Response) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: 'lat and lng query params are required' });
    }

    const incidents = (await prisma.incident.findMany({
      orderBy: { reportedAt: 'desc' },
      take: 200,
    })) as IncidentRecord[];

    const result = calculateSafetyScore(lat, lng, incidents);
    return res.json({
      score: result.score,
      level: result.level,
      lat,
      lng,
      nearbyIncidentCount: result.nearbyIncidents.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[SAFETY] Score lookup failed:', error);
    return res.status(500).json({ error: 'Failed to calculate safety score' });
  }
});

router.get('/incidents', async (req: Request, res: Response) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = Number(req.query.radius ?? 5) / 1000;

    const incidents = (await prisma.incident.findMany({
      orderBy: { reportedAt: 'desc' },
      take: 250,
    })) as IncidentRecord[];

    const filtered = Number.isNaN(lat) || Number.isNaN(lng)
      ? incidents
      : incidents.filter((incident: IncidentRecord) => haversineDistanceKm(lat, lng, incident.lat, incident.lng) <= radiusKm);

    return res.json(
      filtered.map((incident: IncidentRecord) => ({
        id: incident.id,
        userId: incident.userId,
        lat: incident.lat,
        lng: incident.lng,
        type: incident.type,
        description: incident.description,
        riskLevel: incident.riskLevel,
        timestamp: incident.reportedAt.toISOString(),
        verified: incident.verified,
      }))
    );
  } catch (error) {
    console.error('[SAFETY] Incident lookup failed:', error);
    return res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

router.post('/report', async (req: Request, res: Response) => {
  try {
    const { userId, lat, lng, type, description, riskLevel } = req.body;
    if (lat == null || lng == null || !type) {
      return res.status(400).json({ error: 'lat, lng, and type are required' });
    }

    const incident = await prisma.incident.create({
      data: {
        userId: userId || null,
        lat: Number(lat),
        lng: Number(lng),
        type: String(type),
        description: description ? String(description) : `${type} reported`,
        riskLevel: riskLevel ? String(riskLevel).toUpperCase() : 'MEDIUM',
      },
    });

    return res.status(201).json({
      message: 'Incident reported',
      incident: {
        id: incident.id,
        userId: incident.userId,
        lat: incident.lat,
        lng: incident.lng,
        type: incident.type,
        description: incident.description,
        riskLevel: incident.riskLevel,
        timestamp: incident.reportedAt.toISOString(),
        verified: incident.verified,
      },
    });
  } catch (error) {
    console.error('[SAFETY] Incident report failed:', error);
    return res.status(500).json({ error: 'Failed to report incident' });
  }
});

export default router;
