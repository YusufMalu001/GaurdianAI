import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import GlassCard from '../ui/GlassCard';
import { Colors, Theme } from '../../constants/theme';
import { User } from 'lucide-react-native';

interface Props { name: string; hour?: number; }

export default function GreetingCard({ name, hour = new Date().getHours() }: Props) {
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <GlassCard>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <User color={Colors.teal} size={28} />
        </View>
        <View>
          <Text style={styles.greet}>{greeting},</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: Theme.spacing.md,
    borderWidth: 1, borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  greet: { color: Colors.white60, fontSize: 13, marginBottom: 2 },
  name: { color: Colors.white, fontSize: Theme.typography.sizes.lg, fontWeight: '600' },
});
