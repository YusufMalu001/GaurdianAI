import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import GlassCard from '../ui/GlassCard';
import GlowText from '../ui/GlowText';
import { Colors, Theme } from '../../constants/theme';
import { router } from 'expo-router';
import { Activity } from 'lucide-react-native';
import { useLocation } from '../../hooks/useLocation';
import { safetyApi } from '../../services/api/safetyApi';

export default function AIInsightsCard() {
  const { location } = useLocation();
  const [insights, setInsights] = useState<{color: string, text: string}[]>([]);

  useEffect(() => {
    if (!location) return;
    
    // Simulate an AI insight generation based on incidents and score
    safetyApi.getIncidents(location.lat, location.lng, 2000).then(incidents => {
      const newInsights = [];
      if (incidents.length === 0) {
        newInsights.push({ color: Colors.success, text: 'Your current area has a very low incident rate.' });
        newInsights.push({ color: Colors.cyan, text: 'Safety score is optimal for walking.' });
      } else {
        const highRisk = incidents.filter((i: any) => i.riskLevel === 'HIGH').length;
        if (highRisk > 0) {
          newInsights.push({ color: Colors.danger, text: `Detected ${highRisk} high-risk incidents within 2km.` });
        } else {
          newInsights.push({ color: '#FFB800', text: `Moderate activity nearby. Stay aware of your surroundings.` });
        }
        newInsights.push({ color: Colors.success, text: 'Trusted contacts are available if needed.' });
      }
      setInsights(newInsights);
    }).catch(console.error);
  }, [location]);

  return (
    <GlassCard variant="glowCyan">
      <View style={styles.header}>
        <Activity color={Colors.cyan} size={20} />
        <GlowText style={styles.title} color={Colors.cyan} glowColor={Colors.cyan}>AI Insights</GlowText>
        <TouchableOpacity onPress={() => router.push('/(tabs)/insights')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      {insights.map((item, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: item.color, shadowColor: item.color }]} />
          <Text style={styles.text}>{item.text}</Text>
        </View>
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.md },
  title: { flex: 1, fontSize: 14, letterSpacing: 1, marginLeft: Theme.spacing.sm },
  viewAll: { color: Colors.purple, fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Theme.spacing.sm },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    marginTop: 6, marginRight: Theme.spacing.md,
    shadowOpacity: 0.8, shadowRadius: 5, shadowOffset: { width: 0, height: 0 },
  },
  text: { flex: 1, color: Colors.white60, fontSize: 13, lineHeight: 20 },
});
