import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
// In a real scenario, you would import an Expo push notification utility here

export const triggerSOS = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { lat, lng, batteryLevel } = req.body;

    // 1. Create SOSEvent
    const sosEvent = await prisma.sOSEvent.create({
      data: {
        userId,
        lat,
        lng,
        batteryLevel,
        status: 'ACTIVE',
      },
    });

    // 2. Create LiveTrackingSession
    const trackingSession = await prisma.liveTrackingSession.create({
      data: {
        sosEventId: sosEvent.id,
      },
    });

    // 3. Fetch Trusted Contacts
    const contacts = await prisma.trustedContact.findMany({
      where: { userId },
    });

    // 4. Create Notification Records & Dispatch (Mock Push Notifications)
    const notifications = await Promise.all(
      contacts.map(contact => 
        prisma.emergencyNotification.create({
          data: {
            sosEventId: sosEvent.id,
            contactId: contact.id,
            type: 'PUSH',
            // In a real scenario, this would only be set to true AFTER successful push
            delivered: true 
          }
        })
      )
    );

    // TODO: Send actual Expo Push Notifications here using Expo Server SDK

    res.status(201).json({
      message: 'SOS triggered successfully',
      sosEvent,
      trackingSession,
    });
  } catch (error) {
    console.error('Error triggering SOS:', error);
    res.status(500).json({ error: 'Failed to trigger SOS' });
  }
};

export const resolveSOS = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // sosEventId
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sosEvent = await prisma.sOSEvent.update({
      where: { id, userId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    await prisma.liveTrackingSession.updateMany({
      where: { sosEventId: id },
      data: {
        status: 'ENDED',
        endedAt: new Date(),
      },
    });

    res.json({ message: 'SOS resolved successfully', sosEvent });
  } catch (error) {
    console.error('Error resolving SOS:', error);
    res.status(500).json({ error: 'Failed to resolve SOS' });
  }
};
