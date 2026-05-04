import { useState, useEffect } from 'react';
import { useLocation } from './useLocation';
import { safetyApi } from '../services/api/safetyApi';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SafetyData {
  score: number;
  riskLevel: RiskLevel;
  riskColor: string;
}

const levelColors: Record<RiskLevel, string> = {
  LOW: '#00E5C3',
  MEDIUM: '#FFB800',
  HIGH: '#FF3B3B',
  CRITICAL: '#FF3B3B',
};

export function useSafetyScore(): SafetyData {
  const { location } = useLocation();
  const [data, setData] = useState<SafetyData>({
    score: 100,
    riskLevel: 'LOW',
    riskColor: '#00E5C3',
  });

  useEffect(() => {
    if (!location) return;

    let mounted = true;
    const fetchScore = async () => {
      try {
        const res = await safetyApi.getScore(location.lat, location.lng);
        if (mounted && res.score !== undefined) {
          setData({
            score: res.score,
            riskLevel: res.level,
            riskColor: levelColors[res.level as RiskLevel] || '#00E5C3',
          });
        }
      } catch (err) {
        console.error('Failed to fetch safety score:', err);
      }
    };

    fetchScore();
    const interval = setInterval(fetchScore, 30000); // refresh every 30s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [location]);

  return data;
}
