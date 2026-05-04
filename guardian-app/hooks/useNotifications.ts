import { useState, useEffect } from 'react';
import { wsService } from '../services/socket/websocket';

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleAlert = (data: any) => {
      const newNotif: Notification = {
        id: Math.random().toString(36).substring(7),
        type: data.type === 'EMERGENCY' ? 'alert' : 'info',
        title: data.title || 'New Alert',
        message: data.message || 'You have a new notification.',
        timestamp: new Date(),
        read: false,
      };
      setNotifications(prev => [newNotif, ...prev]);
    };

    wsService.on('ALERT', handleAlert);
    return () => wsService.off('ALERT', handleAlert);
  }, []);

  const markRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, markRead, unreadCount };
}
