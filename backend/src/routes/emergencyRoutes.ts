import { Router } from 'express';
import { triggerSOS, resolveSOS } from '../controllers/sosController.js';

const router = Router();

// We need an auth middleware here ideally. We'll simulate user in controller or add it.
// Mock auth middleware for the sake of the hackathon if none exists
const mockAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    // default to some user ID if not provided, or expect it in body
    req.user = { id: req.body.userId || 'demo-user-id' };
  }
  next();
};

router.post('/trigger', mockAuth, triggerSOS);
router.post('/cancel/:id', mockAuth, resolveSOS);

export default router;
