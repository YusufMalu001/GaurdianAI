import Config from '../../constants/config';

type MessageHandler = (data: unknown) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectEnabled = false;
  private activeToken: string | null = null;

  connect(token: string) {
    if (!token) {
      return;
    }

    if (this.activeToken === token && this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.reconnectEnabled = true;
    this.activeToken = token;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.ws?.close();

    try {
      this.ws = new WebSocket(`${Config.WS_URL}?token=${encodeURIComponent(token)}`);
      this.ws.onopen = () => console.log('[WS] Connected');
      this.ws.onclose = () => {
        console.log('[WS] Disconnected');
        this.ws = null;
        if (this.reconnectEnabled && this.activeToken) {
          this.reconnectTimer = setTimeout(() => this.connect(this.activeToken as string), 3000);
        }
      };
      this.ws.onerror = (event) => console.error('[WS] Error:', event);
      this.ws.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(event.data);
          this.handlers.get(type)?.forEach((handler) => handler(data));
        } catch (error) {
          console.error('[WS] Parse error:', error);
        }
      };
    } catch (error) {
      console.error('[WS] Failed to connect:', error);
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }

    this.handlers.get(type)?.push(handler);
  }

  off(type: string, handler: MessageHandler) {
    const list = this.handlers.get(type) ?? [];
    this.handlers.set(type, list.filter((registeredHandler) => registeredHandler !== handler));
  }

  send(type: string, data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  disconnect() {
    this.reconnectEnabled = false;
    this.activeToken = null;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.ws?.close();
    this.ws = null;
  }
}

export const wsService = new WebSocketService();
export default wsService;
