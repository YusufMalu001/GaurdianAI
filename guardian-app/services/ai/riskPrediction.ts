/**
 * AI Risk Prediction Service
 * In production, this calls the backend ML model via API.
 * Here we provide a deterministic mock for the prototype.
 */

export interface RiskPrediction {
  score: number;        // 0–100 (100 = safest)
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;   // 0–1
  factors: string[];
}

export function predictRisk(lat: number, lng: number, hour: number = new Date().getHours()): RiskPrediction {
  // Simplified heuristic: nighttime + variance in coords = higher risk
  const isNight = hour < 6 || hour > 21;
  const coordHash = Math.abs((lat * 1000 + lng * 1000) % 100);

  let score = 100 - coordHash * 0.3 - (isNight ? 20 : 0);
  score = Math.max(0, Math.min(100, Math.round(score)));

  const level: RiskPrediction['level'] =
    score >= 80 ? 'LOW' : score >= 60 ? 'MEDIUM' : score >= 40 ? 'HIGH' : 'CRITICAL';

  return {
    score,
    level,
    confidence: 0.87,
    factors: [
      isNight ? 'Low visibility (night-time)' : 'Good visibility',
      'Police station within 800m',
      'High foot traffic zone',
    ],
  };
}
