import { Router, Request, Response } from 'express';

const router = Router();

// In-memory incident store — starts empty, populated by user reports
const incidents: Array<{
  id: string; lat: number; lng: number; type: string;
  description: string; timestamp: string; riskLevel: string;
}> = [];

// GET /api/safety/score?lat=&lng=
router.get('/score', (req: Request, res: Response) => {
  const { lat, lng } = req.query;
  const isNight = new Date().getHours() < 6 || new Date().getHours() > 21;
  const hash = Math.abs((parseFloat(lat as string) * 1000 + parseFloat(lng as string) * 1000) % 100);
  const score = Math.max(40, Math.min(100, Math.round(100 - hash * 0.3 - (isNight ? 15 : 0))));
  const level = score >= 80 ? 'LOW' : score >= 60 ? 'MEDIUM' : score >= 40 ? 'HIGH' : 'CRITICAL';
  return res.json({ score, level, lat, lng, timestamp: Date.now() });
});

// GET /api/safety/incidents?lat=&lng=&radius=
// Returns a FLAT array (not wrapped in an object) — frontend expects this
router.get('/incidents', (req: Request, res: Response) => {
  return res.json(incidents);
});

// POST /api/safety/report
router.post('/report', (req: Request, res: Response) => {
  const { lat, lng, type, description } = req.body;
  if (!lat || !lng || !type) return res.status(400).json({ error: 'lat, lng, and type are required' });

  const newIncident = {
    id: Date.now().toString(), lat, lng, type,
    description: description || `${type} reported`,
    timestamp: new Date().toISOString(),
    riskLevel: 'MEDIUM',
  };
  incidents.push(newIncident);
  return res.status(201).json({ message: 'Incident reported', incident: newIncident });
});

export default router;
