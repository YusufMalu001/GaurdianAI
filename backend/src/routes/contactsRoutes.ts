import { Router } from 'express';
import { getContacts, addContact, updateContact, deleteContact } from '../controllers/contactsController.js';

const router = Router();

const mockAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    req.user = { id: req.body.userId || req.query.userId || 'demo-user-id' };
  }
  next();
};

router.get('/', mockAuth, getContacts);
router.post('/', mockAuth, addContact);
router.put('/:id', mockAuth, updateContact);
router.delete('/:id', mockAuth, deleteContact);

export default router;
