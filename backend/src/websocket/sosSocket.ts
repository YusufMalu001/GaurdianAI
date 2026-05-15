import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import prisma from '../lib/prisma.js';

export function initializeWebSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);

    // Join SOS Room
    socket.on('join-sos-session', async (data: { sessionId: string }) => {
      const { sessionId } = data;
      socket.join(`sos_${sessionId}`);
      console.log(`[WS] ${socket.id} joined SOS session ${sessionId}`);
      socket.emit('joined-session', { sessionId, message: 'Successfully joined tracking session' });
    });

    // Handle Location Updates from Guardian App
    socket.on('location-update', async (data: { sessionId: string; lat: number; lng: number; batteryLevel?: number }) => {
      const { sessionId, lat, lng, batteryLevel } = data;
      
      // Broadcast to everyone in the room except sender
      socket.to(`sos_${sessionId}`).emit('contact-location', { lat, lng, batteryLevel, timestamp: new Date().toISOString() });
      
      // Optionally save to DB if needed (throttled)
    });

    socket.on('disconnect', () => {
      console.log(`[WS] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
