import React, { useEffect, useRef } from 'react';
import {
  View, StyleSheet, Text, SafeAreaView, ScrollView,
  TouchableOpacity, Animated, Easing, Dimensions,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Theme } from '../../constants/theme';
import GlassCard from '../../components/ui/GlassCard';
import {
  User, Shield, MapPin, Phone, ChevronRight, CheckCircle,
  Clock, Navigation, Lock, Moon, Sparkles, Plus,
  PhoneCall, Heart, UserPlus, Award,
} from 'lucide-react-native';
import { useUserStore } from '../../store/userStore';
import { router } from 'expo-router';

const { width: SW } = Dimensions.get('window');

// ── Animated Counter ────────────────────────────────
function AnimCounter({ value, color }: { value: number; color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = React.useState(0);
  useEffect(() => {
    anim.addListener(({ value: v }) => setDisplay(Math.round(v)));
    Animated.timing(anim, { toValue: value, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => anim.removeAllListeners();
  }, [value]);
  return <Text style={[styles.statVal, { color }]}>{display}</Text>;
}

// ── Stat Card ───────────────────────────────────────
function StatCard({ icon, value, label, color, bgColor, index }: {
  icon: React.ReactNode; value: number; label: string; color: string; bgColor: string; index: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: 200 + index * 100, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: 200 + index * 100, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }], flex: 1 }}>
      <TouchableOpacity activeOpacity={0.85}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 50 }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start()}
      >
        <View style={styles.statCard}>
          <View style={[styles.statIconBadge, { backgroundColor: bgColor }]}>{icon}</View>
          <AnimCounter value={value} color={color} />
          <Text style={styles.statLabel}>{label}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Menu Item ───────────────────────────────────────
function MenuItem({ icon, label, subtitle, onPress, index }: {
  icon: React.ReactNode; label: string; subtitle?: string; onPress: () => void; index: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 100 + index * 60, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 5 }).start()}
      >
        <View style={styles.menuItem}>
          <View style={styles.menuIconContainer}>{icon}</View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>{label}</Text>
            {subtitle && <Text style={styles.menuSub}>{subtitle}</Text>}
          </View>
          <ChevronRight color={Colors.textTertiary} size={16} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Profile Completion Ring ─────────────────────────
function CompletionRing({ percent, size = 52 }: { percent: number; size?: number }) {
  const sw = 4;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (percent / 100) * circ;
  const c = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="compGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={Colors.rose} />
            <Stop offset="100%" stopColor={Colors.brown} />
          </LinearGradient>
        </Defs>
        <Circle cx={c} cy={c} r={r} stroke={Colors.secondary} strokeWidth={sw} fill="none" />
        <Circle cx={c} cy={c} r={r} stroke="url(#compGrad)" strokeWidth={sw} fill="none"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
          transform={`rotate(-90 ${c} ${c})`} />
      </Svg>
      <View style={[styles.ringCenter, { width: size, height: size }]}>
        <Text style={styles.ringText}>{percent}%</Text>
      </View>
    </View>
  );
}

// ═════════════════════════════════════════════════════
// ── MAIN PROFILE SCREEN ─────────────────────────────
// ═════════════════════════════════════════════════════
export default function ProfileScreen() {
  const { profile, trustedContacts } = useUserStore();
  const fadeHeader = useRef(new Animated.Value(0)).current;
  const slideHeader = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const emoji = hour < 12 ? '☀️' : hour < 18 ? '🌤️' : '🌙';

  // Fallback profile data
  const p = profile || { name: 'Burhan', email: 'burhan@guardian.app', phone: '+91 9876543210', totalTrips: 47, safeMiles: 312 };
  const contacts = trustedContacts.length > 0 ? trustedContacts : [
    { id: '1', name: 'Mom', phone: '+91 98765...', relation: 'Family', avatarColor: '#B76E79', isOnline: true },
    { id: '2', name: 'Aisha', phone: '+91 87654...', relation: 'Friend', avatarColor: '#6A89A7', isOnline: true },
    { id: '3', name: 'Dad', phone: '+91 76543...', relation: 'Family', avatarColor: '#8B6F62', isOnline: false },
  ];

  const completionPercent = 85;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeHeader, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideHeader, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.06, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, []);

  const MENU_ITEMS = [
    { icon: <Shield color={Colors.brown} size={18} />, label: 'Settings', subtitle: 'App preferences', onPress: () => router.push('/settings') },
    { icon: <Clock color={Colors.rose} size={18} />, label: 'Travel History', subtitle: '47 trips recorded', onPress: () => {} },
    { icon: <Phone color={Colors.success} size={18} />, label: 'Emergency Contacts', subtitle: `${contacts.length} contacts`, onPress: () => {} },
    { icon: <Lock color={Colors.info} size={18} />, label: 'Privacy & Security', subtitle: 'Data protection', onPress: () => {} },
    { icon: <Moon color={Colors.brownDark} size={18} />, label: 'Appearance', subtitle: 'Light mode', onPress: () => {} },
    { icon: <Sparkles color={Colors.warning} size={18} />, label: 'AI Safety Assistant', subtitle: 'Personalized insights', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Header Section ──────────────── */}
        <Animated.View style={[styles.headerSection, { opacity: fadeHeader, transform: [{ translateY: slideHeader }] }]}>
          {/* Decorative blobs */}
          <View style={[styles.decorBlob, { top: -30, right: -20, backgroundColor: Colors.glowRose, width: 120, height: 120 }]} />
          <View style={[styles.decorBlob, { top: 40, left: -30, backgroundColor: Colors.glowTeal, width: 80, height: 80 }]} />

          {/* Avatar */}
          <Animated.View style={[styles.avatarOuter, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatarRing}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarInitial}>{p.name.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
            {/* Verified badge */}
            <View style={styles.verifiedBadge}>
              <CheckCircle color={Colors.trueWhite} size={12} fill={Colors.success} />
            </View>
          </Animated.View>

          {/* Greeting */}
          <Text style={styles.greetingText}>{greeting}, {p.name.split(' ')[0]} {emoji}</Text>
          <Text style={styles.nameText}>{p.name}</Text>
          <Text style={styles.emailText}>{p.email}</Text>

          {/* Completion + Safety Badge Row */}
          <View style={styles.headerMeta}>
            <View style={styles.completionPill}>
              <CompletionRing percent={completionPercent} size={36} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.completionLabel}>Profile</Text>
                <Text style={styles.completionValue}>{completionPercent}% complete</Text>
              </View>
            </View>
            <View style={styles.safetyBadge}>
              <Award color={Colors.rose} size={14} />
              <Text style={styles.safetyBadgeText}>Trusted User</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Stats Section ───────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
        </View>
        <View style={styles.statsRow}>
          <StatCard icon={<Navigation color={Colors.brown} size={16} />} value={p.totalTrips} label="Safe Trips" color={Colors.brown} bgColor={Colors.glowTeal} index={0} />
          <StatCard icon={<MapPin color={Colors.rose} size={16} />} value={p.safeMiles} label="Safe Miles" color={Colors.rose} bgColor={Colors.glowRose} index={1} />
          <StatCard icon={<Heart color={Colors.success} size={16} />} value={contacts.length} label="Contacts" color={Colors.success} bgColor={Colors.successSoft} index={2} />
        </View>

        {/* ── Trusted Contacts ────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Trusted Contacts</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Plus color={Colors.rose} size={14} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        <GlassCard variant="elevated" style={styles.contactsCard}>
          {contacts.map((c, i) => (
            <View key={c.id} style={[styles.contactRow, i < contacts.length - 1 && styles.contactDivider]}>
              <View style={[styles.contactAvatar, { backgroundColor: c.avatarColor + '18', borderColor: c.avatarColor + '40' }]}>
                <Text style={[styles.contactInitial, { color: c.avatarColor }]}>{c.name[0]}</Text>
                {c.isOnline && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{c.name}</Text>
                <Text style={styles.contactMeta}>{c.relation} · {c.phone}</Text>
              </View>
              <TouchableOpacity style={styles.callBtn}>
                <PhoneCall color={Colors.success} size={16} />
              </TouchableOpacity>
            </View>
          ))}
          {/* Emergency shortcut */}
          <TouchableOpacity style={styles.emergencyRow} onPress={() => router.push('/sos/emergency')}>
            <View style={styles.emergencyIcon}>
              <Phone color={Colors.textOnAccent} size={14} />
            </View>
            <Text style={styles.emergencyText}>Quick Emergency Call</Text>
            <ChevronRight color={Colors.danger} size={14} />
          </TouchableOpacity>
        </GlassCard>

        {/* ── Quick Links ─────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Settings & Preferences</Text>
        </View>

        <GlassCard variant="elevated" style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <React.Fragment key={item.label}>
              <MenuItem icon={item.icon} label={item.label} subtitle={item.subtitle} onPress={item.onPress} index={i} />
              {i < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </GlassCard>

        {/* ── AI Safety Tip ───────────────── */}
        <View style={styles.aiTipBanner}>
          <View style={styles.aiTipIcon}>
            <Sparkles color={Colors.rose} size={16} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTipTitle}>Safety Insight</Text>
            <Text style={styles.aiTipText}>Complete your emergency contacts to unlock advanced safety features.</Text>
          </View>
        </View>

        {/* ── Sign Out ────────────────────── */}
        <TouchableOpacity style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Guardian v1.0.0 · Made with ❤️</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

// ═════════════════════════════════════════════════════
// ── STYLES ───────────────────────────────────────────
// ═════════════════════════════════════════════════════
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  scrollContent: { paddingBottom: 120 },

  // Header
  headerSection: {
    alignItems: 'center', paddingTop: Theme.spacing.xl, paddingBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg, position: 'relative', overflow: 'hidden',
  },
  decorBlob: { position: 'absolute', borderRadius: 999, opacity: 0.6 },
  avatarOuter: { alignItems: 'center', justifyContent: 'center', marginBottom: Theme.spacing.md },
  avatarGlow: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55,
    backgroundColor: Colors.glowRose, opacity: 0.5,
  },
  avatarRing: {
    width: 92, height: 92, borderRadius: 46, padding: 3,
    borderWidth: 2.5, borderColor: Colors.rose, alignItems: 'center', justifyContent: 'center',
  },
  avatarInner: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.rose,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { color: Colors.textOnAccent, fontSize: 30, fontWeight: '700' },
  verifiedBadge: {
    position: 'absolute', bottom: 2, right: -2, width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.cardSolid, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primary,
  },
  greetingText: { color: Colors.textSecondary, fontSize: Theme.typography.sizes.sm, marginBottom: 4 },
  nameText: { color: Colors.textPrimary, fontSize: Theme.typography.sizes.xxl, fontWeight: '700', letterSpacing: -0.5 },
  emailText: { color: Colors.textTertiary, fontSize: Theme.typography.sizes.sm, marginTop: 2 },

  // Header Meta
  headerMeta: {
    flexDirection: 'row', alignItems: 'center', marginTop: Theme.spacing.lg, gap: 12,
  },
  completionPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.cardSolid,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: Theme.borderRadius.pill,
    borderWidth: 1, borderColor: Colors.cardBorder, ...Theme.shadows.soft,
  },
  completionLabel: { color: Colors.textTertiary, fontSize: 10, fontWeight: '500' },
  completionValue: { color: Colors.textPrimary, fontSize: 12, fontWeight: '600' },
  ringCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringText: { color: Colors.rose, fontSize: 9, fontWeight: '700' },
  safetyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.glowRose,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: Theme.borderRadius.pill,
  },
  safetyBadgeText: { color: Colors.rose, fontSize: 11, fontWeight: '600' },

  // Section Header
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg, marginTop: Theme.spacing.lg, marginBottom: Theme.spacing.md,
  },
  sectionTitle: { color: Colors.textPrimary, fontSize: Theme.typography.sizes.lg, fontWeight: '700', letterSpacing: -0.3 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { color: Colors.rose, fontSize: Theme.typography.sizes.sm, fontWeight: '600' },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: Theme.spacing.lg },
  statCard: {
    backgroundColor: Colors.cardSolid, borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md, alignItems: 'center', borderWidth: 1,
    borderColor: Colors.cardBorder, ...Theme.shadows.soft,
  },
  statIconBadge: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statVal: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  statLabel: { color: Colors.textTertiary, fontSize: 11, fontWeight: '500', marginTop: 4, textAlign: 'center' },

  // Contacts
  contactsCard: { marginHorizontal: Theme.spacing.lg, padding: Theme.spacing.sm },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: Theme.spacing.sm },
  contactDivider: { borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  contactAvatar: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', marginRight: Theme.spacing.md, position: 'relative',
  },
  contactInitial: { fontSize: 17, fontWeight: '700' },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.cardSolid,
  },
  contactInfo: { flex: 1 },
  contactName: { color: Colors.textPrimary, fontWeight: '600', fontSize: Theme.typography.sizes.md },
  contactMeta: { color: Colors.textTertiary, fontSize: 12, marginTop: 2 },
  callBtn: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.successSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  emergencyRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 8,
    paddingVertical: 12, paddingHorizontal: Theme.spacing.sm,
    backgroundColor: Colors.dangerSoft, borderRadius: Theme.borderRadius.md,
  },
  emergencyIcon: {
    width: 30, height: 30, borderRadius: 10, backgroundColor: Colors.danger,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  emergencyText: { flex: 1, color: Colors.danger, fontSize: 13, fontWeight: '600' },

  // Menu
  menuCard: { marginHorizontal: Theme.spacing.lg, padding: 4 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: Theme.spacing.sm,
  },
  menuIconContainer: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.secondary,
    alignItems: 'center', justifyContent: 'center', marginRight: Theme.spacing.md,
  },
  menuContent: { flex: 1 },
  menuLabel: { color: Colors.textPrimary, fontSize: Theme.typography.sizes.md, fontWeight: '600' },
  menuSub: { color: Colors.textTertiary, fontSize: 12, marginTop: 1 },
  menuDivider: { height: 1, backgroundColor: Colors.cardBorder, marginLeft: 52 },

  // AI Tip
  aiTipBanner: {
    flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.xl, backgroundColor: Colors.glowRose,
    borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md,
    borderWidth: 1, borderColor: 'rgba(183, 110, 121, 0.12)',
  },
  aiTipIcon: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(183, 110, 121, 0.15)',
    alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 2,
  },
  aiTipTitle: { color: Colors.rose, fontSize: Theme.typography.sizes.sm, fontWeight: '700', marginBottom: 2 },
  aiTipText: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },

  // Footer
  signOutBtn: {
    marginHorizontal: Theme.spacing.lg, marginTop: Theme.spacing.xl,
    paddingVertical: 14, borderRadius: Theme.borderRadius.md,
    borderWidth: 1, borderColor: Colors.cardBorder, alignItems: 'center',
    backgroundColor: Colors.cardSolid,
  },
  signOutText: { color: Colors.danger, fontSize: Theme.typography.sizes.md, fontWeight: '600' },
  versionText: {
    color: Colors.textTertiary, fontSize: 11, textAlign: 'center',
    marginTop: Theme.spacing.lg, marginBottom: Theme.spacing.xl,
  },
});
