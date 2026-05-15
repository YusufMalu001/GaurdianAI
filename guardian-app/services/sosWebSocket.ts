import io, { Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001'; // Update to backend URL

class SOSWebSocket {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);
      this.socket.on('connect', () => console.log('Connected to WS'));
    }
  }

  joinSession(sessionId: string) {
    if (this.socket) {
      this.socket.emit('join-sos-session', { sessionId });
    }
  }

  sendLocationUpdate(sessionId: string, lat: number, lng: number, batteryLevel?: number) {
    if (this.socket) {
      this.socket.emit('location-update', { sessionId, lat, lng, batteryLevel });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onContactLocation(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('contact-location', callback);
    }
  }
}

export const sosWebSocket = new SOSWebSocket();
