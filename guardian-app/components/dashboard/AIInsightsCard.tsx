import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import GlassCard from '../ui/GlassCard';
import { Colors, Theme } from '../../constants/theme';
import { Sparkles, ShieldCheck, AlertTriangle, Lightbulb } from 'lucide-react-native';
import { useLocation } from '../../hooks/useLocation';
import { safetyApi } from '../../services/api/safetyApi';

const DEFAULT_INSIGHTS = [
  {
    icon: 'shield',
    color: Colors.success,
    bg: Colors.successSoft,
    title: 'Area Safety',
    text: 'This area has a very low incident rate. Safe for walking.',
  },
  {
    icon: 'lightbulb',
    color: Colors.brown,
    bg: Colors.glowTeal,
    title: 'Smart Tip',
    text: 'Share your live location with trusted contacts while traveling.',
  },
  {
    icon: 'alert',
    color: Colors.warning,
    bg: Colors.warningSoft,
    title: 'Be Aware',
    text: 'Reduced visibility in this area after 9 PM. Stay on lit paths.',
  },
];

export default function AIInsightsCard() {
  const { location } = useLocation();
  const [insights, setInsights] = useState(DEFAULT_INSIGHTS);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!location) return;
    safetyApi.getIncidents(location.lat, location.lng, 2000).then(incidents => {
      const newInsights = [];
      if (!incidents || incidents.length === 0) {
        newInsights.push({
          icon: 'shield',
          color: Colors.success,
          bg: Colors.successSoft,
          title: 'All Clear',
          text: 'Your current area has a very low incident rate.',
        });
        newInsights.push({
          icon: 'lightbulb',
          color: Colors.brown,
          bg: Colors.glowTeal,
          title: 'Optimal Conditions',
          text: 'Safety score is excellent for outdoor activities.',
        });
      } else {
        const highRisk = incidents.filter((i: any) => i.riskLevel === 'HIGH').length;
        if (highRisk > 0) {
          newInsights.push({
            icon: 'alert',
            color: Colors.danger,
            bg: Colors.dangerSoft,
            title: 'Caution Advised',
            text: `${highRisk} high-risk incident${highRisk > 1 ? 's' : ''} detected within 2km radius.`,
          });
        } else {
          newInsights.push({
            icon: 'alert',
            color: Colors.warning,
            bg: Colors.warningSoft,
            title: 'Moderate Activity',
            text: 'Stay aware of your surroundings in this area.',
          });
        }
        newInsights.push({
          icon: 'shield',
          color: Colors.success,
          bg: Colors.successSoft,
          title: 'Support Ready',
          text: 'Trusted contacts are available if you need assistance.',
        });
      }
      setInsights(newInsights);
    }).catch(() => {});
  }, [location]);

  const getIcon = (type: string, color: string) => {
    switch (type) {
      case 'shield': return <ShieldCheck color={color} size={16} />;
      case 'lightbulb': return <Lightbulb color={color} size={16} />;
      case 'alert': return <AlertTriangle color={color} size={16} />;
      default: return <Sparkles color={color} size={16} />;
    }
  };

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
    }}>
      <GlassCard variant="elevated">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconBadge}>
            <Sparkles color={Colors.rose} size={16} />
          </View>
          <View>
            <Text style={styles.title}>AI Insights</Text>
            <Text style={styles.subtitle}>Context-aware safety analysis</Text>
          </View>
        </View>

        {/* Insights List */}
        {insights.map((item, i) => (
          <View key={i} style={[styles.insightRow, i < insights.length - 1 && styles.insightDivider]}>
            <View style={[styles.insightIconBadge, { backgroundColor: item.bg }]}>
              {getIcon(item.icon, item.color)}
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{item.title}</Text>
              <Text style={styles.insightText}>{item.text}</Text>
            </View>
          </View>
        ))}
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  headerIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.glowRose,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Theme.typography.sizes.md,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: Colors.textTertiary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Theme.spacing.sm + 2,
  },
  insightDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  insightIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm + 4,
    marginTop: 2,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    color: Colors.textPrimary,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
