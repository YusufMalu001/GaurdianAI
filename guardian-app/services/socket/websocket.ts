import Config from '../../constants/config';

type MessageHandler = (data: unknown) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect(token: string) {
    try {
      this.ws = new WebSocket(`${Config.WS_URL}?token=${token}`);
      this.ws.onopen = () => console.log('[WS] Connected');
      this.ws.onclose = () => {
        console.log('[WS] Disconnected – reconnecting in 3s');
        this.reconnectTimer = setTimeout(() => this.connect(token), 3000);
      };
      this.ws.onerror = (e) => console.error('[WS] Error:', e);
      this.ws.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(event.data);
          this.handlers.get(type)?.forEach((h) => h(data));
        } catch (err) {
          console.error('[WS] Parse error:', err);
        }
      };
    } catch (err) {
      console.error('[WS] Failed to connect:', err);
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) this.handlers.set(type, []);
    this.handlers.get(type)!.push(handler);
  }

  off(type: string, handler: MessageHandler) {
    const list = this.handlers.get(type) ?? [];
    this.handlers.set(type, list.filter((h) => h !== handler));
  }

  send(type: string, data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }
}

export const wsService = new WebSocketService();
export default wsService;
