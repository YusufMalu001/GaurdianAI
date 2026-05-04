import { create } from 'zustand';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatarColor: string;
  isOnline: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  totalTrips: number;
  safeMiles: number;
}

interface UserState {
  profile: UserProfile | null;
  trustedContacts: Contact[];
  setProfile: (profile: UserProfile) => void;
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  trustedContacts: [],
  setProfile: (profile) => set({ profile }),
  setContacts: (trustedContacts) => set({ trustedContacts }),
  addContact: (contact) =>
    set((state) => ({ trustedContacts: [...state.trustedContacts, contact] })),
  removeContact: (id) =>
    set((state) => ({ trustedContacts: state.trustedContacts.filter((c) => c.id !== id) })),
}));
