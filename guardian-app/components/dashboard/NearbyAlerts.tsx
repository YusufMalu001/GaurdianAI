import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Animated, Easing } from 'react-native';
import GlassCard from '../ui/GlassCard';
import { Colors, Theme } from '../../constants/theme';
import { AlertTriangle, ShieldAlert, Clock, MapPin } from 'lucide-react-native';
import { safetyApi } from '../../services/api/safetyApi';
import { useLocation } from '../../hooks/useLocation';

// Mock data for when the API isn't available
const MOCK_ALERTS = [
  {
    id: '1',
    type: 'Suspicious Activity',
    riskLevel: 'MEDIUM',
    distance: '0.8 km away',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
  },
  {
    id: '2',
    type: 'Poor Lighting',
    riskLevel: 'LOW',
    distance: '1.2 km away',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago
  },
  {
    id: '3',
    type: 'Road Incident',
    riskLevel: 'HIGH',
    distance: '2.5 km away',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hrs ago
  },
];

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function AlertCard({ alert, index }: { alert: any; index: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const isHigh = alert.riskLevel === 'HIGH' || alert.riskLevel === 'CRITICAL';
  const accentColor = isHigh ? Colors.danger : Colors.warning;
  const bgColor = isHigh ? Colors.dangerSoft : Colors.warningSoft;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateX: slideAnim }],
    }}>
      <View style={[styles.alertCard, { borderLeftColor: accentColor }]}>
        {/* Icon Badge */}
        <View style={[styles.alertIconBadge, { backgroundColor: bgColor }]}>
          {isHigh
            ? <ShieldAlert color={accentColor} size={18} />
            : <AlertTriangle color={accentColor} size={18} />
          }
        </View>

        {/* Content */}
        <View style={styles.alertContent}>
          <Text style={styles.alertType}>{alert.type}</Text>
          <View style={styles.alertMeta}>
            <MapPin color={Colors.textTertiary} size={11} />
            <Text style={styles.alertMetaText}>{alert.distance}</Text>
            <Clock color={Colors.textTertiary} size={11} />
            <Text style={styles.alertMetaText}>{timeAgo(alert.timestamp)}</Text>
          </View>
        </View>

        {/* Severity Chip */}
        <View style={[styles.severityChip, { backgroundColor: bgColor }]}>
          <Text style={[styles.severityText, { color: accentColor }]}>
            {alert.riskLevel}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function NearbyAlerts() {
  const { location } = useLocation();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!location) return;
    safetyApi.getIncidents(location.lat, location.lng, 5000)
      .then(res => {
        if (res && res.length > 0) {
          setAlerts(res.slice(0, 4).map((a: any, i: number) => ({
            ...a,
            distance: `${(0.5 + i * 0.7).toFixed(1)} km away`,
          })));
        } else {
          setAlerts(MOCK_ALERTS);
        }
      })
      .catch(() => setAlerts(MOCK_ALERTS));
  }, [location]);

  if (alerts.length === 0) {
    // Use mock data if nothing loaded yet
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {MOCK_ALERTS.map((alert, index) => (
          <AlertCard key={alert.id} alert={alert} index={index} />
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {alerts.map((alert, index) => (
        <AlertCard key={alert.id || index} alert={alert} index={index} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingRight: Theme.spacing.lg,
    paddingVertical: Theme.spacing.xs,
  },
  alertCard: {
    width: 200,
    backgroundColor: Colors.cardSolid,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.md,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Theme.shadows.medium,
  },
  alertIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.sm,
  },
  alertContent: {
    flex: 1,
  },
  alertType: {
    color: Colors.textPrimary,
    fontSize: Theme.typography.sizes.md,
    fontWeight: '600',
    marginBottom: 6,
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertMetaText: {
    color: Colors.textTertiary,
    fontSize: 11,
    fontWeight: '500',
    marginRight: 8,
  },
  severityChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: Theme.spacing.sm,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
