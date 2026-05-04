import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import GlassCard from '../ui/GlassCard';
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
        newInsights.push({ color: Colors.teal, text: 'Safety score is optimal for walking.' });
      } else {
        const highRisk = incidents.filter((i: any) => i.riskLevel === 'HIGH').length;
        if (highRisk > 0) {
          newInsights.push({ color: Colors.danger, text: `Detected ${highRisk} high-risk incidents within 2km.` });
        } else {
          newInsights.push({ color: '#F59E0B', text: `Moderate activity nearby. Stay aware of your surroundings.` });
        }
        newInsights.push({ color: Colors.success, text: 'Trusted contacts are available if needed.' });
      }
      setInsights(newInsights);
    }).catch(console.error);
  }, [location]);

  return (
    <GlassCard>
      <View style={styles.header}>
        <Activity color={Colors.teal} size={20} />
        <Text style={styles.title}>AI Insights</Text>
      </View>
      {insights.map((item, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.text}>{item.text}</Text>
        </View>
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.md },
  title: { flex: 1, color: Colors.teal, fontSize: 14, fontWeight: '600', letterSpacing: 0.5, marginLeft: Theme.spacing.sm },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Theme.spacing.sm },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    marginTop: 7, marginRight: Theme.spacing.md,
  },
  text: { flex: 1, color: Colors.white80, fontSize: 13, lineHeight: 20 },
});
