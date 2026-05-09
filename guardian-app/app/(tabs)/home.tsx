import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';
import { Colors, Theme } from '../../constants/theme';
import SafetyScore from '../../components/ui/SafetyScore';
import GlassCard from '../../components/ui/GlassCard';
import {
  Bell,
  MapPin,
  Navigation,
  Flame,
  Share2,
  Phone,
  Shield,
  ChevronRight,
  Zap,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useLocation } from '../../hooks/useLocation';
import { useSafetyScore } from '../../hooks/useSafetyScore';
import NearbyAlerts from '../../components/dashboard/NearbyAlerts';
import AIInsightsCard from '../../components/dashboard/AIInsightsCard';
import GreetingCard from '../../components/dashboard/GreetingCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Quick Action Button ─────────────────────────────
function QuickAction({
  icon,
  title,
  subtitle,
  accentColor,
  bgColor,
  onPress,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accentColor: string;
  bgColor: string;
  onPress: () => void;
  index: number;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 200 + index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: 200 + index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      flex: 1,
    }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[styles.quickActionCard, { borderColor: bgColor }]}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: bgColor }]}>
          {icon}
        </View>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── SOS Quick Action (Special) ──────────────────────
function SOSAction({ index }: { index: number }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 200 + index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: 200 + index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle pulse for SOS
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }, { scale: Animated.multiply(scaleAnim, pulseAnim) }],
      flex: 1,
    }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => router.push('/sos/emergency')}
        style={styles.sosActionCard}
      >
        <View style={styles.sosActionIcon}>
          <Flame color={Colors.textOnAccent} size={22} />
        </View>
        <Text style={styles.sosActionTitle}>SOS</Text>
        <Text style={styles.sosActionSubtitle}>Emergency</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Section Header ──────────────────────────────────
function SectionHeader({ title, actionText, onAction }: {
  title: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionText && (
        <TouchableOpacity onPress={onAction} style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{actionText}</Text>
          <ChevronRight color={Colors.rose} size={14} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ═══════════════════════════════════════════════════
// ── MAIN HOME SCREEN ──────────────────────────────
// ═══════════════════════════════════════════════════
export default function HomeScreen() {
  const { user } = useAuthStore();
  const { location } = useLocation();
  const { score, riskLevel, riskColor } = useSafetyScore();
  const name = user?.name ?? 'Burhan';

  const scrollY = useRef(new Animated.Value(0)).current;

  // Map preview HTML
  const mapPreviewHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; background-color: #F6F1EB; }
        #map { width: 100vw; height: 100vh; }
        .leaflet-container { background: #F6F1EB; }
        .leaflet-control-container { display: none; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(183, 110, 121, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(183, 110, 121, 0); }
          100% { box-shadow: 0 0 0 0 rgba(183, 110, 121, 0); }
        }
        .user-dot {
          width: 14px; height: 14px;
          background: #B76E79;
          border-radius: 50%;
          border: 3px solid #FFFDF9;
          animation: pulse 2s infinite;
          box-shadow: 0 2px 8px rgba(183, 110, 121, 0.3);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        var lat = ${location?.lat ?? 28.6139};
        var lng = ${location?.lng ?? 77.209};
        var map = L.map('map', { 
          zoomControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          touchZoom: false,
          attributionControl: false,
        }).setView([lat, lng], 15);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        var icon = L.divIcon({ html: '<div class="user-dot"></div>', className: '', iconSize: [14, 14] });
        L.marker([lat, lng], { icon: icon }).addTo(map);
      </script>
    </body>
    </html>
  `;

  const riskStatusText = riskLevel === 'LOW'
    ? 'Area is well-lit and populated'
    : riskLevel === 'MEDIUM'
    ? 'Moderate activity in this area'
    : 'Stay alert — higher incident frequency';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* ── Header ─────────────────────────────── */}
        <View style={styles.header}>
          <GreetingCard name={name} />
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={styles.bellButton}
          >
            <Bell color={Colors.brown} size={20} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* ── Live Location Badge ─────────────────── */}
        <View style={styles.locationBadge}>
          <View style={styles.liveDot} />
          <MapPin color={Colors.textSecondary} size={13} />
          <Text style={styles.locationText}>
            {location
              ? `${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E`
              : 'Detecting location...'}
          </Text>
        </View>

        {/* ── Hero Safety Card ────────────────────── */}
        <GlassCard variant="elevated" style={styles.heroCard}>
          <View style={styles.heroContent}>
            {/* Safety Score Ring */}
            <SafetyScore score={score} size={130} />

            {/* Score Details */}
            <View style={styles.heroDetails}>
              <View style={[styles.riskBadge, {
                backgroundColor: riskLevel === 'LOW' ? Colors.successSoft
                  : riskLevel === 'MEDIUM' ? Colors.warningSoft : Colors.dangerSoft
              }]}>
                <Shield color={riskColor} size={12} />
                <Text style={[styles.riskBadgeText, { color: riskColor }]}>
                  {riskLevel} RISK
                </Text>
              </View>
              <Text style={styles.riskDescription}>{riskStatusText}</Text>
              <TouchableOpacity
                style={styles.viewDetailsBtn}
                onPress={() => router.push('/(tabs)/heatmap')}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
                <ChevronRight color={Colors.rose} size={14} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Map Preview */}
          <View style={styles.mapPreview}>
            <View style={styles.mapPreviewInner}>
              {Platform.OS === 'web' ? (
                <iframe
                  srcDoc={mapPreviewHtml}
                  style={{ width: '100%', height: '100%', border: 'none', borderRadius: 16 }}
                  title="Map Preview"
                />
              ) : (
                <WebView
                  source={{ html: mapPreviewHtml }}
                  style={{ flex: 1, borderRadius: 16 }}
                  scrollEnabled={false}
                />
              )}
            </View>
            {/* Map Overlay Gradient */}
            <View style={styles.mapOverlay}>
              <TouchableOpacity
                style={styles.mapOverlayBtn}
                onPress={() => router.push('/(tabs)/map')}
              >
                <Navigation color={Colors.textOnAccent} size={14} />
                <Text style={styles.mapOverlayText}>Open Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>

        {/* ── Quick Actions ───────────────────────── */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.quickActionsRow}>
          <QuickAction
            icon={<Navigation color={Colors.brown} size={20} />}
            title="Safe Route"
            subtitle="Navigate"
            accentColor={Colors.brown}
            bgColor={Colors.glowTeal}
            onPress={() => router.push('/(tabs)/map')}
            index={0}
          />
          <SOSAction index={1} />
          <QuickAction
            icon={<Share2 color={Colors.rose} size={20} />}
            title="Share"
            subtitle="Location"
            accentColor={Colors.rose}
            bgColor={Colors.glowRose}
            onPress={() => {}}
            index={2}
          />
          <QuickAction
            icon={<Phone color={Colors.info} size={20} />}
            title="Contacts"
            subtitle="Emergency"
            accentColor={Colors.info}
            bgColor={Colors.infoSoft}
            onPress={() => router.push('/settings')}
            index={3}
          />
        </View>

        {/* ── Nearby Alerts ───────────────────────── */}
        <SectionHeader title="Nearby Alerts" actionText="See All" onAction={() => router.push('/(tabs)/heatmap')} />
        <NearbyAlerts />

        {/* ── AI Insights ─────────────────────────── */}
        <View style={{ marginTop: Theme.spacing.xl }}>
          <SectionHeader title="AI Recommendations" />
          <AIInsightsCard />
        </View>

        {/* ── Safety Tip Banner ───────────────────── */}
        <View style={styles.tipBanner}>
          <View style={styles.tipIconBadge}>
            <Zap color={Colors.warning} size={16} />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Pro Tip</Text>
            <Text style={styles.tipText}>
              Enable background location for real-time safety monitoring even when the app is closed.
            </Text>
          </View>
        </View>

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════
// ── STYLES ────────────────────────────────────────
// ═══════════════════════════════════════════════════
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 120,
    paddingTop: Theme.spacing.md,
  },

  // ── Header ──────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardSolid,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Theme.shadows.soft,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.cardSolid,
  },

  // ── Location Badge ──────────────
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.cardSolid,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.pill,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Theme.shadows.soft,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  locationText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    letterSpacing: 0.2,
  },

  // ── Hero Card ───────────────────
  heroCard: {
    marginBottom: Theme.spacing.xl,
    padding: Theme.spacing.lg,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroDetails: {
    flex: 1,
    marginLeft: Theme.spacing.lg,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: Theme.spacing.sm,
    gap: 4,
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  riskDescription: {
    color: Colors.textSecondary,
    fontSize: Theme.typography.sizes.sm,
    lineHeight: 20,
    marginBottom: Theme.spacing.sm,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    color: Colors.rose,
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Map Preview ─────────────────
  mapPreview: {
    height: 110,
    marginTop: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.secondary,
    position: 'relative',
  },
  mapPreviewInner: {
    flex: 1,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  mapOverlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brown,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Theme.borderRadius.pill,
    gap: 5,
    ...Theme.shadows.medium,
  },
  mapOverlayText: {
    color: Colors.textOnAccent,
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Section Headers ─────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Theme.typography.sizes.lg,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionActionText: {
    color: Colors.rose,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: '600',
  },

  // ── Quick Actions ───────────────
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Theme.spacing.xl,
  },
  quickActionCard: {
    backgroundColor: Colors.cardSolid,
    borderRadius: Theme.borderRadius.lg,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...Theme.shadows.soft,
    minHeight: 100,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    color: Colors.textTertiary,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },

  // ── SOS Action Card ─────────────
  sosActionCard: {
    backgroundColor: Colors.danger,
    borderRadius: Theme.borderRadius.lg,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(192, 80, 95, 0.3)',
    ...Theme.shadows.soft,
    minHeight: 100,
    shadowColor: Colors.danger,
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  sosActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sosActionTitle: {
    color: Colors.textOnAccent,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 2,
  },
  sosActionSubtitle: {
    color: 'rgba(255, 253, 249, 0.7)',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },

  // ── Tip Banner ──────────────────
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warningSoft,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginTop: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(201, 150, 58, 0.15)',
  },
  tipIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(201, 150, 58, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm + 2,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: Colors.warning,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: '700',
    marginBottom: 3,
  },
  tipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
