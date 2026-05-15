import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { initializeWebSocket } from './websocket/sosSocket.js';
import authRoutes from './routes/authRoutes.js';
import safetyRoutes from './routes/safetyRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import contactsRoutes from './routes/contactsRoutes.js';
import prisma from './lib/prisma.js';
import { onRealtimeEvent } from './lib/realtime.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/routes', mapRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/contacts', contactsRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', time: new Date().toISOString() });
  } catch (error) {
    console.error('[HEALTH] Database check failed:', error);
    res.status(500).json({ status: 'error', database: 'disconnected', time: new Date().toISOString() });
  }
});

const httpServer = createServer(app);

// Initialize Socket.IO Server (for SOS Live Tracking)
const io = initializeWebSocket(httpServer);

// Initialize raw WebSocket Server (for generic Realtime Events)
const wss = new WebSocketServer({ server: httpServer, path: '/' });

const stopRealtimeBridge = onRealtimeEvent((event) => {
  // Broadcast to Socket.IO
  io.emit('realtime-event', event);
  
  // Broadcast to raw WS
  const payload = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
});

wss.on('connection', (ws, req) => {
  console.log(`[WS] Raw client connected from ${req.socket.remoteAddress}`);
  ws.send(JSON.stringify({ type: 'CONNECTED', data: { message: 'Guardian WS server ready' } }));
  
  ws.on('message', (raw) => {
    try {
      const { type, data } = JSON.parse(raw.toString());
      if (type === 'LOCATION_UPDATE') {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'CONTACT_LOCATION', data }));
          }
        });
      }
    } catch (err) {
      console.error('[WS] Message parse error:', err);
    }
  });

  ws.on('close', () => console.log('[WS] Raw client disconnected'));
});

httpServer.listen(PORT, () => {
  console.log(`Guardian Backend running on http://localhost:${PORT}`);
});

const shutdown = async () => {
  stopRealtimeBridge();
  await prisma.$disconnect();
};

process.on('SIGINT', () => {
  shutdown().finally(() => process.exit(0));
});

process.on('SIGTERM', () => {
  shutdown().finally(() => process.exit(0));
});
