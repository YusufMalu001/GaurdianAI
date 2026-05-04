import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import GlassCard from '../ui/GlassCard';
import { Colors, Theme } from '../../constants/theme';
import { Navigation, Clock } from 'lucide-react-native';

interface Props { destination: string; distanceKm: number; etaMinutes: number; safetyScore: number; }

export default function RouteCard({ destination, distanceKm, etaMinutes, safetyScore }: Props) {
  const color = safetyScore >= 80 ? Colors.success : safetyScore >= 50 ? '#FFB800' : Colors.danger;
  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <Navigation color={Colors.purple} size={20} />
        <Text style={styles.dest} numberOfLines={1}>{destination}</Text>
        <View style={[styles.badge, { borderColor: color }]}>
          <Text style={[styles.badgeText, { color }]}>{safetyScore}%</Text>
        </View>
      </View>
      <View style={styles.meta}>
        <Clock color={Colors.white60} size={14} />
        <Text style={styles.metaText}>{etaMinutes} min · {distanceKm.toFixed(1)} km</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: Theme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  dest: { flex: 1, color: Colors.white, fontWeight: '600', marginLeft: Theme.spacing.sm, fontSize: 15 },
  badge: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: Theme.spacing.sm },
  metaText: { color: Colors.white60, fontSize: 13, marginLeft: 6 },
});
