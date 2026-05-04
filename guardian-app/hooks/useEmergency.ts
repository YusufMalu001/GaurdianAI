import { useState, useCallback } from 'react';

export interface EmergencyState {
  isActive: boolean;
  countdown: number;
  triggered: boolean;
}

export function useEmergency() {
  const [state, setState] = useState<EmergencyState>({
    isActive: false,
    countdown: 5,
    triggered: false,
  });

  const triggerSOS = useCallback(() => {
    setState(prev => ({ ...prev, isActive: true, triggered: true }));
    // In production: call emergencyApi.trigger(), start audio recording, stream location
  }, []);

  const cancelSOS = useCallback(() => {
    setState({ isActive: false, countdown: 5, triggered: false });
    // In production: cancel alert, notify contacts
  }, []);

  const decrementCountdown = useCallback(() => {
    setState(prev => ({ ...prev, countdown: Math.max(0, prev.countdown - 1) }));
  }, []);

  return { state, triggerSOS, cancelSOS, decrementCountdown };
}
