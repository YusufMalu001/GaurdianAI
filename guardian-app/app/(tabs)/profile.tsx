import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Theme } from '../../constants/theme';
import GlassCard from '../../components/ui/GlassCard';
import GlowText from '../../components/ui/GlowText';
import { User, Shield, MapPin, Phone, ChevronRight } from 'lucide-react-native';
import { useUserStore } from '../../store/userStore';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { profile, trustedContacts } = useUserStore();

  if (!profile) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <GlowText color={Colors.white} glowColor={Colors.purple}>Loading profile...</GlowText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User color={Colors.purple} size={40} />
          </View>
          <GlowText style={styles.name} color={Colors.white} glowColor={Colors.purple}>{profile.name}</GlowText>
          <Text style={styles.email}>{profile.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statVal}>{profile.totalTrips}</Text>
            <Text style={styles.statLabel}>Safe Trips</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statVal}>{profile.safeMiles}</Text>
            <Text style={styles.statLabel}>Safe Miles</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statVal}>{trustedContacts.length}</Text>
            <Text style={styles.statLabel}>Contacts</Text>
          </GlassCard>
        </View>

        {/* Trusted Contacts */}
        <Text style={styles.sectionTitle}>TRUSTED CONTACTS</Text>
        {trustedContacts.map(c => (
          <GlassCard key={c.id} style={styles.contactCard}>
            <View style={[styles.contactAvatar, { backgroundColor: c.avatarColor + '30', borderColor: c.avatarColor }]}>
              <Text style={[styles.contactInitial, { color: c.avatarColor }]}>{c.name[0]}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{c.name}</Text>
              <Text style={styles.contactMeta}>{c.relation} · {c.phone}</Text>
            </View>
            <View style={[styles.onlineDot, { backgroundColor: c.isOnline ? Colors.success : Colors.white60 }]} />
          </GlassCard>
        ))}

        {/* Quick Links */}
        <Text style={styles.sectionTitle}>QUICK LINKS</Text>
        {[
          { icon: Shield, label: 'Settings', onPress: () => router.push('/settings/') },
          { icon: MapPin, label: 'Travel History', onPress: () => {} },
          { icon: Phone, label: 'Emergency Contacts', onPress: () => {} },
        ].map(({ icon: Icon, label, onPress }) => (
          <TouchableOpacity key={label} onPress={onPress}>
            <GlassCard style={styles.linkCard}>
              <Icon color={Colors.cyan} size={20} />
              <Text style={styles.linkText}>{label}</Text>
              <ChevronRight color={Colors.white60} size={18} />
            </GlassCard>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  center: { alignItems: 'center', justifyContent: 'center' },
  container: { padding: Theme.spacing.lg, paddingBottom: 100 },
  avatarSection: { alignItems: 'center', marginBottom: Theme.spacing.xl },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(123,47,247,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.purple,
    shadowColor: Colors.purple, shadowOpacity: 0.6, shadowRadius: 20, shadowOffset: { width: 0, height: 0 },
    marginBottom: Theme.spacing.md,
  },
  name: { fontSize: Theme.typography.sizes.xl, letterSpacing: 1 },
  email: { color: Colors.white60, fontSize: 13, marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Theme.spacing.xl },
  statCard: { width: '30%', alignItems: 'center', padding: Theme.spacing.md },
  statVal: { color: Colors.cyan, fontSize: 22, fontWeight: '800' },
  statLabel: { color: Colors.white60, fontSize: 11, marginTop: 4, textAlign: 'center' },
  sectionTitle: { color: Colors.white60, fontSize: 12, letterSpacing: 2, fontWeight: '700', marginBottom: Theme.spacing.md },
  contactCard: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.md, marginBottom: Theme.spacing.sm },
  contactAvatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: Theme.spacing.md },
  contactInitial: { fontSize: 18, fontWeight: '800' },
  contactInfo: { flex: 1 },
  contactName: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  contactMeta: { color: Colors.white60, fontSize: 12, marginTop: 2 },
  onlineDot: { width: 10, height: 10, borderRadius: 5 },
  linkCard: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.md, marginBottom: Theme.spacing.sm },
  linkText: { flex: 1, color: Colors.white, fontSize: 15, fontWeight: '600', marginLeft: Theme.spacing.md },
});
