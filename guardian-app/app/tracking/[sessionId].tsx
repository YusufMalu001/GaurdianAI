import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { sosWebSocket } from '../../services/sosWebSocket';
import { ShieldAlert, Battery, Clock, Navigation } from 'lucide-react-native';

export default function TrackingScreen() {
  const { sessionId } = useLocalSearchParams();
  const [contactLocation, setContactLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [routePath, setRoutePath] = useState<{ latitude: number; longitude: number }[]>([]);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [timeActive, setTimeActive] = useState('00:00');

  useEffect(() => {
    if (!sessionId) return;

    sosWebSocket.connect();
    sosWebSocket.joinSession(sessionId as string);

    sosWebSocket.onContactLocation((data) => {
      setContactLocation({ lat: data.lat, lng: data.lng });
      setRoutePath((prev) => [...prev, { latitude: data.lat, longitude: data.lng }]);
      if (data.batteryLevel !== undefined) {
        setBatteryLevel(data.batteryLevel);
      }
    });

    // Simple timer
    const startTime = Date.now();
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const mins = Math.floor(diff / 60).toString().padStart(2, '0');
      const secs = (diff % 60).toString().padStart(2, '0');
      setTimeActive(`${mins}:${secs}`);
    }, 1000);

    return () => {
      sosWebSocket.disconnect();
      clearInterval(interval);
    };
  }, [sessionId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Emergency Tracking</Text>
        <ShieldAlert color="#ff3b30" size={24} />
      </View>

      <View style={styles.mapContainer}>
        {contactLocation ? (
          <MapView
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={{
              latitude: contactLocation.lat,
              longitude: contactLocation.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            region={{
              latitude: contactLocation.lat,
              longitude: contactLocation.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{ latitude: contactLocation.lat, longitude: contactLocation.lng }}
              title="User in Distress"
              pinColor="#ff3b30"
            />
            {routePath.length > 1 && (
              <Polyline
                coordinates={routePath}
                strokeColor="#ff3b30"
                strokeWidth={4}
              />
            )}
          </MapView>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Awaiting location signal...</Text>
          </View>
        )}
      </View>

      <View style={styles.telemetryPanel}>
        <View style={styles.telemetryCard}>
          <Navigation color="#007aff" size={20} />
          <Text style={styles.telemetryLabel}>Status</Text>
          <Text style={styles.telemetryValue}>MOVING</Text>
        </View>
        <View style={styles.telemetryCard}>
          <Clock color="#ff9500" size={20} />
          <Text style={styles.telemetryLabel}>Time Active</Text>
          <Text style={styles.telemetryValue}>{timeActive}</Text>
        </View>
        <View style={styles.telemetryCard}>
          <Battery color="#34c759" size={20} />
          <Text style={styles.telemetryLabel}>Battery</Text>
          <Text style={styles.telemetryValue}>{batteryLevel ? `${batteryLevel}%` : '--'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  backBtn: { padding: 5 },
  backText: { color: '#007aff', fontSize: 16 },
  title: { color: '#ff3b30', fontSize: 18, fontWeight: 'bold' },
  mapContainer: { flex: 1, overflow: 'hidden' },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#aaa' },
  telemetryPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  telemetryCard: {
    alignItems: 'center',
    flex: 1,
  },
  telemetryLabel: { color: '#aaa', fontSize: 12, marginTop: 5 },
  telemetryValue: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
});
