import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, Theme } from '../../constants/theme';
import { MapPin } from 'lucide-react-native';

interface Props { lat: number; lng: number; label?: string; color?: string; }

export default function LocationMarker({ lat, lng, label, color = Colors.cyan }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.ring, { borderColor: color }]}>
        <MapPin color={color} size={20} />
      </View>
      {label && <Text style={[styles.label, { color }]}>{label}</Text>}
      <Text style={styles.coords}>{lat.toFixed(4)}, {lng.toFixed(4)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  ring: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 2,
    backgroundColor: Colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  label: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  coords: { color: Colors.white60, fontSize: 10 },
});
