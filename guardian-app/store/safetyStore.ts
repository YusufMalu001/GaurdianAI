import { create } from 'zustand';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface SafetyState {
  score: number;
  riskLevel: RiskLevel;
  isTracking: boolean;
  currentLocation: { lat: number; lng: number } | null;
  setScore: (score: number) => void;
  setRiskLevel: (level: RiskLevel) => void;
  setTracking: (tracking: boolean) => void;
  setLocation: (location: { lat: number; lng: number }) => void;
}

export const useSafetyStore = create<SafetyState>((set) => ({
  score: 0,
  riskLevel: 'LOW',
  isTracking: false,
  currentLocation: null,
  setScore: (score) => set({ score }),
  setRiskLevel: (riskLevel) => set({ riskLevel }),
  setTracking: (isTracking) => set({ isTracking }),
  setLocation: (currentLocation) => set({ currentLocation }),
}));
