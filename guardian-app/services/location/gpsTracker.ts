export interface GPSPosition {
  lat: number;
  lng: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

type PositionCallback = (pos: GPSPosition) => void;

class GPSTracker {
  private watchId: number | null = null;
  private mockInterval: ReturnType<typeof setInterval> | null = null;

  start(onUpdate: PositionCallback, onError?: (err: string) => void) {
    // Web / React Native Geolocation API
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) =>
          onUpdate({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            speed: pos.coords.speed ?? undefined,
            heading: pos.coords.heading ?? undefined,
            timestamp: pos.timestamp,
          }),
        (err) => onError?.(err.message),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
      );
    } else {
      // Fallback mock for environments without geolocation
      let lat = 28.6139;
      let lng = 77.209;
      this.mockInterval = setInterval(() => {
        lat += (Math.random() - 0.5) * 0.0002;
        lng += (Math.random() - 0.5) * 0.0002;
        onUpdate({ lat, lng, timestamp: Date.now() });
      }, 2000);
    }
  }

  stop() {
    if (this.watchId !== null && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }
}

export const gpsTracker = new GPSTracker();
export default gpsTracker;
