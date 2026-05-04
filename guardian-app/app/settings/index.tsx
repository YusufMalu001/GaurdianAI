import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Theme } from '../../constants/theme';
import GlassCard from '../../components/ui/GlassCard';
import GlowText from '../../components/ui/GlowText';
import { Bell, Shield, ToggleLeft, Globe, Lock } from 'lucide-react-native';

const SETTINGS = [
  {
    group: 'SAFETY',
    items: [
      { icon: Shield, label: 'Auto SOS Detection', desc: 'Trigger SOS on sudden fall or impact', value: true },
      { icon: Bell, label: 'Danger Zone Alerts', desc: 'Alert when entering high-risk areas', value: true },
      { icon: Globe, label: 'Live Location Share', desc: 'Share with trusted contacts 24/7', value: false },
    ],
  },
  {
    group: 'PRIVACY',
    items: [
      { icon: Lock, label: 'Stealth Mode', desc: 'Hide app icon from recent apps', value: false },
      { icon: Lock, label: 'Disguise Mode', desc: 'Disguise as a calculator app', value: false },
    ],
  },
];

export default function SettingsScreen() {
  const [values, setValues] = React.useState<Record<string, boolean>>(
    Object.fromEntries(SETTINGS.flatMap(g => g.items).map(i => [i.label, i.value]))
  );

  const toggle = (label: string) => setValues(v => ({ ...v, [label]: !v[label] }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <GlowText style={styles.heading} color={Colors.white} glowColor={Colors.purple}>SETTINGS</GlowText>

        {SETTINGS.map(group => (
          <View key={group.group}>
            <Text style={styles.groupTitle}>{group.group}</Text>
            {group.items.map(({ icon: Icon, label, desc }) => (
              <GlassCard key={label} style={styles.card}>
                <View style={styles.row}>
                  <Icon color={Colors.cyan} size={20} />
                  <View style={styles.info}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.desc}>{desc}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggle(label)}
                    style={[styles.toggle, { backgroundColor: values[label] ? Colors.purple : 'rgba(255,255,255,0.1)' }]}
                  >
                    <View style={[styles.thumb, { alignSelf: values[label] ? 'flex-end' : 'flex-start' }]} />
                  </TouchableOpacity>
                </View>
              </GlassCard>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { padding: Theme.spacing.lg, paddingBottom: 100 },
  heading: { fontSize: 22, letterSpacing: 3, marginBottom: Theme.spacing.xl },
  groupTitle: { color: Colors.white60, fontSize: 11, letterSpacing: 2, fontWeight: '700', marginBottom: Theme.spacing.md, marginTop: Theme.spacing.md },
  card: { padding: Theme.spacing.md, marginBottom: Theme.spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: Theme.spacing.md },
  label: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  desc: { color: Colors.white60, fontSize: 12, marginTop: 2 },
  toggle: { width: 44, height: 24, borderRadius: 12, padding: 2 },
  thumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.white },
});
