import * as Location from 'expo-location';
import { Platform } from 'react-native';

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
  private subscription: Location.LocationSubscription | null = null;
  private mockInterval: ReturnType<typeof setInterval> | null = null;

  async start(onUpdate: PositionCallback, onError?: (err: string) => void) {
    if (Platform.OS === 'web') {
      // For web, use browser geolocation or mock
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (pos) => onUpdate({
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
        this.startMock(onUpdate);
      }
      return;
    }

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        onError?.('Permission to access location was denied');
        return;
      }

      this.subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        (location) => {
          onUpdate({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            accuracy: location.coords.accuracy ?? undefined,
            speed: location.coords.speed ?? undefined,
            heading: location.coords.heading ?? undefined,
            timestamp: location.timestamp,
          });
        }
      );
    } catch (err: any) {
      onError?.(err.message || 'Failed to start GPS tracking');
    }
  }

  private startMock(onUpdate: PositionCallback) {
    let lat = 28.6139;
    let lng = 77.209;
    this.mockInterval = setInterval(() => {
      lat += (Math.random() - 0.5) * 0.0002;
      lng += (Math.random() - 0.5) * 0.0002;
      onUpdate({ lat, lng, timestamp: Date.now() });
    }, 2000);
  }

  stop() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }
}

export const gpsTracker = new GPSTracker();
export default gpsTracker;
