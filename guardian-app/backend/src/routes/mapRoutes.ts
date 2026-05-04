import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/routes/safe?originLat=&originLng=&destLat=&destLng=
router.get('/safe', (req: Request, res: Response) => {
  const { originLat, originLng, destLat, destLng } = req.query;

  // Mock safe route response
  const route = {
    origin: { lat: parseFloat(originLat as string), lng: parseFloat(originLng as string) },
    destination: { lat: parseFloat(destLat as string), lng: parseFloat(destLng as string) },
    waypoints: [
      { lat: parseFloat(originLat as string) + 0.001, lng: parseFloat(originLng as string) + 0.001, name: 'Checkpoint A' },
      { lat: parseFloat(originLat as string) + 0.002, lng: parseFloat(originLng as string) + 0.002, name: 'Checkpoint B' },
    ],
    safetyScore: 91,
    estimatedTimeMinutes: 14,
    distanceKm: 2.4,
    avoidedDangerZones: 2,
  };

  return res.json(route);
});

// GET /api/routes/heatmap?lat=&lng=&radius=
router.get('/heatmap', (req: Request, res: Response) => {
  const zones = [
    { lat: 28.614, lng: 77.210, risk: 'HIGH', color: '#FF3B3B', radius: 300 },
    { lat: 28.615, lng: 77.208, risk: 'MEDIUM', color: '#FFB800', radius: 200 },
    { lat: 28.613, lng: 77.211, risk: 'LOW', color: '#00E5C3', radius: 150 },
  ];
  return res.json({ zones, total: zones.length });
});

export default router;
