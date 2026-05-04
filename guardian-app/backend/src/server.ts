import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import authRoutes from './routes/authRoutes.js';
import safetyRoutes from './routes/safetyRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/routes', mapRoutes);
app.use('/api/emergency', emergencyRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// HTTP + WebSocket Server
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws, req) => {
  console.log(`[WS] Client connected from ${req.socket.remoteAddress}`);

  ws.send(JSON.stringify({ type: 'CONNECTED', data: { message: 'Guardian WS server ready' } }));

  ws.on('message', (raw) => {
    try {
      const { type, data } = JSON.parse(raw.toString());
      if (type === 'LOCATION_UPDATE') {
        // Broadcast to all connected clients (in production: only trusted contacts)
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(JSON.stringify({ type: 'CONTACT_LOCATION', data }));
          }
        });
      }
    } catch (err) {
      console.error('[WS] Message parse error:', err);
    }
  });

  ws.on('close', () => console.log('[WS] Client disconnected'));
});

httpServer.listen(PORT, () => {
  console.log(`🛡️  Guardian Backend running on http://localhost:${PORT}`);
});
