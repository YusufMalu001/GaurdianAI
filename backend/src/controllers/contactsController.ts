import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const getContacts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming authMiddleware sets req.user
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const contacts = await prisma.trustedContact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

export const addContact = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { contactName, phoneNumber, email, relationship, isPriority, guardianUserId } = req.body;

    // Check max 5 limit
    const count = await prisma.trustedContact.count({ where: { userId } });
    if (count >= 5) {
      return res.status(400).json({ error: 'Maximum of 5 trusted contacts allowed' });
    }

    const newContact = await prisma.trustedContact.create({
      data: {
        userId,
        contactName,
        phoneNumber,
        email,
        relationship,
        isPriority: isPriority || false,
        guardianUserId
      },
    });

    res.status(201).json({ contact: newContact });
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ error: 'Failed to add contact' });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { contactName, phoneNumber, email, relationship, isPriority } = req.body;

    const updatedContact = await prisma.trustedContact.update({
      where: { id, userId },
      data: {
        contactName,
        phoneNumber,
        email,
        relationship,
        isPriority,
      },
    });

    res.json({ contact: updatedContact });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.trustedContact.delete({
      where: { id, userId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};
