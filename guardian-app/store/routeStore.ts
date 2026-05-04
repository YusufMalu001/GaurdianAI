import { create } from 'zustand';

interface Waypoint {
  lat: number;
  lng: number;
  name?: string;
}

interface RouteState {
  origin: Waypoint | null;
  destination: Waypoint | null;
  waypoints: Waypoint[];
  safetyRating: number;
  estimatedTime: number; // in minutes
  isNavigating: boolean;
  setOrigin: (origin: Waypoint) => void;
  setDestination: (dest: Waypoint) => void;
  startNavigation: () => void;
  stopNavigation: () => void;
  clearRoute: () => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  origin: null,
  destination: null,
  waypoints: [],
  safetyRating: 0,
  estimatedTime: 0,
  isNavigating: false,
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  startNavigation: () => set({ isNavigating: true }),
  stopNavigation: () => set({ isNavigating: false }),
  clearRoute: () =>
    set({ origin: null, destination: null, waypoints: [], isNavigating: false }),
}));
