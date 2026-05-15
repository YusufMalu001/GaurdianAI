import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../store/authStore';
import { wsService } from '../services/socket/websocket';

function SocketBootstrap() {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      wsService.connect(token);
      return () => wsService.disconnect();
    }

    wsService.disconnect();
    return undefined;
  }, [token]);

  return null;
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <SocketBootstrap />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.primary },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/screen1" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="sos/emergency"
          options={{ presentation: 'fullScreenModal' }}
        />
      </Stack>
    </>
  );
}
