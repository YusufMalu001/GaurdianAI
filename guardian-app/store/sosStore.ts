import { create } from 'zustand';

interface SOSState {
  isSOSActive: boolean;
  sessionId: string | null;
  location: { lat: number; lng: number } | null;
  trustedContacts: any[];
  setSOSActive: (active: boolean, sessionId?: string) => void;
  setLocation: (location: { lat: number; lng: number }) => void;
  setTrustedContacts: (contacts: any[]) => void;
}

export const useSOSStore = create<SOSState>((set) => ({
  isSOSActive: false,
  sessionId: null,
  location: null,
  trustedContacts: [],
  setSOSActive: (active, sessionId = null) => set({ isSOSActive: active, sessionId }),
  setLocation: (location) => set({ location }),
  setTrustedContacts: (contacts) => set({ trustedContacts: contacts }),
}));
