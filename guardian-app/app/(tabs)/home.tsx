import React from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Theme } from '../../constants/theme';
import SafetyScore from '../../components/ui/SafetyScore';
import GlassCard from '../../components/ui/GlassCard';
import GlowText from '../../components/ui/GlowText';
import { Bell, MapPin, Navigation, Video, Mic } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useLocation } from '../../hooks/useLocation';
import { useSafetyScore } from '../../hooks/useSafetyScore';
import NearbyAlerts from '../../components/dashboard/NearbyAlerts';
import AIInsightsCard from '../../components/dashboard/AIInsightsCard';
import GreetingCard from '../../components/dashboard/GreetingCard';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { location } = useLocation();
  const { score, riskLevel, riskColor } = useSafetyScore();
  const name = user?.name ?? 'Guest';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <GreetingCard name={name} />
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications/')} style={styles.bellWrapper}>
            <View style={styles.bellContainer}>
              <Bell color={Colors.white} size={24} />
              <View style={styles.notificationDot} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <GlassCard variant="glowCyan" style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MapPin color={Colors.cyan} size={16} />
            <Text style={styles.locationText}>
              {location ? `Current: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Detecting location...'}
            </Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <SafetyScore score={score} size={140} />
            
            <View style={styles.scoreDetails}>
              <Text style={[styles.riskLevel, { color: riskColor }]}>{riskLevel} RISK</Text>
              <Text style={styles.riskDesc}>
                {riskLevel === 'LOW' ? 'Area is well-lit and populated.' : 'Caution: Incident frequency higher in this area.'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionBtn, { borderColor: Colors.purple }]}
            onPress={() => router.push('/(tabs)/map')}
          >
            <Navigation color={Colors.purple} size={28} />
            <Text style={styles.actionText}>Safe Route</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionBtn, { borderColor: Colors.pink }]}>
            <Video color={Colors.pink} size={28} />
            <Text style={styles.actionText}>Fake Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionBtn, { borderColor: Colors.cyan }]}>
            <Mic color={Colors.cyan} size={28} />
            <Text style={styles.actionText}>Record</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby Alerts */}
        <Text style={styles.sectionTitle}>NEARBY ALERTS</Text>
        <NearbyAlerts />

        {/* AI Insights */}
        <View style={{ marginTop: Theme.spacing.lg }}>
          <AIInsightsCard />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    padding: Theme.spacing.lg,
    paddingBottom: 100, // padding for bottom tabs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    marginTop: Theme.spacing.md,
  },
  greeting: {
    color: Colors.white60,
    fontSize: Theme.typography.sizes.md,
  },
  name: {
    fontSize: Theme.typography.sizes.xl,
    letterSpacing: 1,
  },
  bellWrapper: {
    marginLeft: Theme.spacing.md,
  },
  bellContainer: {
    padding: Theme.spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
    shadowColor: Colors.danger,
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  statusCard: {
    marginBottom: Theme.spacing.xxl,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  locationText: {
    color: Colors.cyan,
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: '600',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreDetails: {
    flex: 1,
    marginLeft: Theme.spacing.lg,
  },
  riskLevel: {
    color: Colors.success,
    fontSize: Theme.typography.sizes.lg,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: Theme.spacing.xs,
  },
  riskDesc: {
    color: Colors.white60,
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: Theme.typography.sizes.md,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: Theme.spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xxl,
  },
  actionBtn: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: Colors.white,
    fontSize: 12,
    marginTop: Theme.spacing.sm,
    fontWeight: '600',
  },
});
