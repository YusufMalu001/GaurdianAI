import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import GlassCard from '../ui/GlassCard';
import GlowText from '../ui/GlowText';
import { Colors, Theme } from '../../constants/theme';
import { User } from 'lucide-react-native';

interface Props { name: string; hour?: number; }

export default function GreetingCard({ name, hour = new Date().getHours() }: Props) {
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <GlassCard variant="glowPurple">
      <View style={styles.row}>
        <View style={styles.avatar}>
          <User color={Colors.purple} size={28} />
        </View>
        <View>
          <Text style={styles.greet}>{greeting},</Text>
          <GlowText style={styles.name} glowColor={Colors.purple}>{name}</GlowText>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(123,47,247,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: Theme.spacing.md,
    borderWidth: 1, borderColor: Colors.glowPurple,
  },
  greet: { color: Colors.white60, fontSize: 13 },
  name: { fontSize: Theme.typography.sizes.xl, letterSpacing: 1 },
});
