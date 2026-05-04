import { Router, Request, Response } from 'express';

const router = Router();

const activeAlerts: Array<{
  id: string; userId: string; lat: number; lng: number; timestamp: number; status: string;
}> = [];

// POST /api/emergency/trigger
router.post('/trigger', (req: Request, res: Response) => {
  const { userId, lat, lng } = req.body;
  if (!userId || !lat || !lng) return res.status(400).json({ error: 'userId, lat, lng required' });

  const alert = { id: Date.now().toString(), userId, lat, lng, timestamp: Date.now(), status: 'ACTIVE' };
  activeAlerts.push(alert);

  console.log(`🚨 [EMERGENCY] Alert triggered for user ${userId} at (${lat}, ${lng})`);
  // In production: notify authorities via SMS/API, push to trusted contacts via WS

  return res.status(201).json({ message: 'Emergency alert triggered', alert });
});

// POST /api/emergency/cancel/:id
router.post('/cancel/:id', (req: Request, res: Response) => {
  const alert = activeAlerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  alert.status = 'CANCELLED';
  console.log(`✅ [EMERGENCY] Alert ${req.params.id} cancelled`);
  return res.json({ message: 'Alert cancelled', alert });
});

// POST /api/emergency/notify
router.post('/notify', (req: Request, res: Response) => {
  const { contactIds, alertId } = req.body;
  console.log(`📲 [EMERGENCY] Notifying contacts ${contactIds} for alert ${alertId}`);
  // In production: send push notifications / SMS to each contactId
  return res.json({ message: `Notified ${contactIds?.length ?? 0} contacts`, alertId });
});

export default router;
