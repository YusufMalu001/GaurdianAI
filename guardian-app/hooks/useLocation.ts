import { useState, useEffect } from 'react';
import gpsTracker, { GPSPosition } from '../services/location/gpsTracker';

export function useLocation() {
  const [location, setLocation] = useState<GPSPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gpsTracker.start(
      (pos) => {
        setLocation(pos);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => gpsTracker.stop();
  }, []);

  return { location, error, loading };
}
