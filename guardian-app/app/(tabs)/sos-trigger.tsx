import { Redirect } from 'expo-router';

// This file exists solely to satisfy the Expo Router tab navigator.
// The actual SOS screen is at /sos/emergency and is navigated to via tabPress listener.
export default function SOSTriggerPlaceholder() {
  return <Redirect href="/(tabs)/home" />;
}
