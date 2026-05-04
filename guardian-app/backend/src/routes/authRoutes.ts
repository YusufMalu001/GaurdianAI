import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'guardian_secret_dev';

// Mock user store (replace with DB in production)
const users: Array<{ id: string; name: string; email: string; phone: string; passwordHash: string }> = [];

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), name, email, phone, passwordHash };
  users.push(user);

  const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ token, user: { id: user.id, name, email, phone } });
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  // Stateless JWT – client discards token
  return res.json({ message: 'Logged out successfully' });
});

export default router;
