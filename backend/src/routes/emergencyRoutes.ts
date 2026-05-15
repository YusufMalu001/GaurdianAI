import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { publishRealtimeEvent } from '../lib/realtime.js';

const router = Router();

interface TrustedContactRecord {
  id: string;
}

router.post('/trigger', async (req: Request, res: Response) => {
  try {
    const { userId, lat, lng } = req.body;
    if (!userId || lat == null || lng == null) {
      return res.status(400).json({ error: 'userId, lat, and lng are required' });
    }

    const alert = await prisma.emergencyAlert.create({
      data: {
        userId: String(userId),
        lat: Number(lat),
        lng: Number(lng),
        status: 'ACTIVE',
      },
    });

    publishRealtimeEvent({
      type: 'ALERT',
      data: {
        type: 'EMERGENCY',
        title: 'Emergency alert triggered',
        message: 'A user triggered SOS and shared their live location.',
        alertId: alert.id,
        userId: alert.userId,
        lat: alert.lat,
        lng: alert.lng,
        timestamp: alert.triggeredAt.toISOString(),
      },
    });

    return res.status(201).json({
      message: 'Emergency alert triggered',
      alert: {
        id: alert.id,
        userId: alert.userId,
        lat: alert.lat,
        lng: alert.lng,
        timestamp: alert.triggeredAt.getTime(),
        status: alert.status,
      },
    });
  } catch (error) {
    console.error('[EMERGENCY] Trigger failed:', error);
    return res.status(500).json({ error: 'Failed to trigger emergency alert' });
  }
});

router.post('/cancel/:id', async (req: Request, res: Response) => {
  try {
    const existing = await prisma.emergencyAlert.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const alert = await prisma.emergencyAlert.update({
      where: { id: req.params.id },
      data: {
        status: 'CANCELLED',
        resolvedAt: new Date(),
      },
    });

    publishRealtimeEvent({
      type: 'ALERT',
      data: {
        type: 'EMERGENCY_CANCELLED',
        title: 'Emergency alert cancelled',
        message: 'The SOS session was cancelled.',
        alertId: alert.id,
        userId: alert.userId,
        timestamp: alert.resolvedAt?.toISOString(),
      },
    });

    return res.json({
      message: 'Alert cancelled',
      alert: {
        id: alert.id,
        userId: alert.userId,
        lat: alert.lat,
        lng: alert.lng,
        timestamp: alert.triggeredAt.getTime(),
        status: alert.status,
      },
    });
  } catch (error) {
    console.error('[EMERGENCY] Cancel failed:', error);
    return res.status(500).json({ error: 'Failed to cancel alert' });
  }
});

router.post('/notify', async (req: Request, res: Response) => {
  try {
    const contactIds = Array.isArray(req.body.contactIds) ? req.body.contactIds.map(String) : [];
    const alertId = String(req.body.alertId ?? '');
    if (!alertId) {
      return res.status(400).json({ error: 'alertId is required' });
    }

    const contacts = contactIds.length
      ? ((await prisma.trustedContact.findMany({ where: { id: { in: contactIds } } })) as TrustedContactRecord[])
      : [];

    if (contacts.length > 0) {
      await prisma.alertNotification.createMany({
        data: contacts.map((contact: TrustedContactRecord) => ({
          alertId,
          contactId: contact.id,
          delivered: true,
        })),
      });
    }

    publishRealtimeEvent({
      type: 'ALERT',
      data: {
        type: 'CONTACTS_NOTIFIED',
        title: 'Trusted contacts notified',
        message: `${contacts.length} trusted contact(s) notified.`,
        alertId,
      },
    });

    return res.json({ message: `Notified ${contacts.length} contacts`, alertId });
  } catch (error) {
    console.error('[EMERGENCY] Notify failed:', error);
    return res.status(500).json({ error: 'Failed to notify contacts' });
  }
});

export default router;
