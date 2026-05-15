import { EventEmitter } from 'node:events';

export interface RealtimeEvent {
  type: string;
  data: unknown;
}

const emitter = new EventEmitter();

export function publishRealtimeEvent(event: RealtimeEvent) {
  emitter.emit('message', event);
}

export function onRealtimeEvent(handler: (event: RealtimeEvent) => void) {
  emitter.on('message', handler);
  return () => emitter.off('message', handler);
}
