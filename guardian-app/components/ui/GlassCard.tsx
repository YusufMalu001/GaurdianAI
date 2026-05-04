import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Theme } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function GlassCard({ children, style }: GlassCardProps) {
  return (
    <View style={[styles.card, Theme.shadows.glass, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backdropFilter: 'blur(10px)', // Note: backdropFilter is primarily web-only, on native it relies on backgroundColor opacity
    overflow: 'hidden',
  },
});
