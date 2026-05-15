import * as Location from 'expo-location';
import { sosWebSocket } from './sosWebSocket';

const LOCATION_TASK_NAME = 'background-location-task';

export const startEmergencyLocationTracking = async (sessionId: string) => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
        showsBackgroundLocationIndicator: true,
      });

      // Handle background updates via TaskManager (would be defined in root index.js usually)
    }

    // Also start a foreground interval for immediate feedback
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 5,
      },
      (location) => {
        sosWebSocket.sendLocationUpdate(
          sessionId,
          location.coords.latitude,
          location.coords.longitude
        );
      }
    );
  }
};
