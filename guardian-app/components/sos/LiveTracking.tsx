import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import GlassCard from '../ui/GlassCard';
import GlowText from '../ui/GlowText';
import { Colors, Theme } from '../../constants/theme';
import { Navigation, Mic, Radio } from 'lucide-react-native';
import gpsTracker from '../../services/location/gpsTracker';

export default function LiveTracking() {
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.209 });

  useEffect(() => {
    gpsTracker.start((pos) => setPosition({ lat: pos.lat, lng: pos.lng }));
    return () => gpsTracker.stop();
  }, []);

  return (
    <GlassCard variant="glowCyan" style={styles.card}>
      <GlowText style={styles.title} color={Colors.cyan} glowColor={Colors.cyan}>LIVE TRACKING</GlowText>
      <View style={styles.row}>
        <Navigation color={Colors.cyan} size={16} />
        <Text style={styles.coord}>{position.lat.toFixed(5)}, {position.lng.toFixed(5)}</Text>
      </View>
      <View style={styles.indicators}>
        <View style={styles.pill}>
          <Mic color={Colors.white} size={14} />
          <Text style={styles.pillText}>AUDIO</Text>
          <View style={[styles.dot, { backgroundColor: Colors.danger }]} />
        </View>
        <View style={styles.pill}>
          <Radio color={Colors.white} size={14} />
          <Text style={styles.pillText}>STREAMING</Text>
          <View style={[styles.dot, { backgroundColor: Colors.success }]} />
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: Theme.spacing.md },
  title: { fontSize: 13, letterSpacing: 2, marginBottom: Theme.spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.sm },
  coord: { color: Colors.white, fontFamily: 'monospace', marginLeft: 6, fontSize: 13 },
  indicators: { flexDirection: 'row', gap: Theme.spacing.sm },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: Theme.borderRadius.pill,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  pillText: { color: Colors.white, fontSize: 10, fontWeight: '700', marginHorizontal: 6 },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
