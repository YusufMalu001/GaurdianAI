import React from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { Colors, Theme } from '../../constants/theme';
import GlassCard from '../../components/ui/GlassCard';
import GlowText from '../../components/ui/GlowText';
import NeonButton from '../../components/ui/NeonButton';
import { WifiOff, ShieldCheck, Clock, MapPin } from 'lucide-react-native';

const STATUS_ITEMS = [
  { icon: ShieldCheck, label: 'Emergency Contacts', value: 'Cached (3)', color: Colors.success },
  { icon: MapPin, label: 'Last Known Location', value: '28.6139, 77.209', color: Colors.cyan },
  { icon: Clock, label: 'Last Sync', value: '2 min ago', color: '#FFB800' },
];

export default function OfflineModeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <WifiOff color={Colors.pink} size={72} style={styles.icon} />
          <GlowText style={styles.heading} color={Colors.white} glowColor={Colors.pink}>OFFLINE SAFETY MODE</GlowText>
          <Text style={styles.desc}>
            No internet? Guardian still has you covered. Emergency SOS, cached contacts, and local alerts are all available offline.
          </Text>
        </View>

        <View style={styles.statusList}>
          {STATUS_ITEMS.map(({ icon: Icon, label, value, color }) => (
            <GlassCard key={label} style={styles.card}>
              <Icon color={color} size={20} />
              <View style={styles.info}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={[styles.infoValue, { color }]}>{value}</Text>
              </View>
            </GlassCard>
          ))}
        </View>

        <NeonButton
          title="TRIGGER OFFLINE SOS"
          variant="danger"
          onPress={() => {}}
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { flex: 1, padding: Theme.spacing.lg, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: Theme.spacing.xxl },
  icon: { marginBottom: Theme.spacing.lg },
  heading: { fontSize: 22, letterSpacing: 2, textAlign: 'center', marginBottom: Theme.spacing.md },
  desc: { color: Colors.white60, fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: Theme.spacing.lg },
  statusList: { marginBottom: Theme.spacing.xxl },
  card: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.md, marginBottom: Theme.spacing.sm },
  info: { marginLeft: Theme.spacing.md },
  infoLabel: { color: Colors.white60, fontSize: 12 },
  infoValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  btn: { marginTop: Theme.spacing.md },
});
