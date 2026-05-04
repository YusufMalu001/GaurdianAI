import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Colors, Theme } from '../../constants/theme';

// Heatmap overlay rendered as colored circles on the Leaflet map (web-only).
// On native, this component shows a legend only.
const ZONES = [
  { id: '1', lat: 28.614, lng: 77.210, risk: 'HIGH', color: '#FF3B3B', radius: 300 },
  { id: '2', lat: 28.615, lng: 77.208, risk: 'MEDIUM', color: '#FFB800', radius: 200 },
  { id: '3', lat: 28.613, lng: 77.211, risk: 'LOW', color: '#00E5C3', radius: 150 },
];

export default function HeatmapOverlay() {
  return (
    <View style={styles.legend}>
      <Text style={styles.legendTitle}>RISK ZONES</Text>
      {ZONES.map(z => (
        <View key={z.id} style={styles.legendRow}>
          <View style={[styles.dot, { backgroundColor: z.color }]} />
          <Text style={styles.legendText}>{z.risk} — {z.radius}m radius</Text>
        </View>
      ))}
    </View>
  );
}

export { ZONES };

const styles = StyleSheet.create({
  legend: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  legendTitle: { color: Colors.white, fontWeight: '700', fontSize: 12, letterSpacing: 1, marginBottom: Theme.spacing.sm },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: Theme.spacing.sm },
  legendText: { color: Colors.white60, fontSize: 13 },
});
