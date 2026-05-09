import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Theme } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined' | 'frosted';
}

export default function GlassCard({ children, style, variant = 'default' }: GlassCardProps) {
  const variantStyle = variantStyles[variant];
  return (
    <View style={[styles.card, variantStyle, style]}>
      {children}
    </View>
  );
}

const variantStyles: Record<string, ViewStyle> = {
  default: {
    backgroundColor: Colors.card,
    borderColor: Colors.cardBorder,
    ...Theme.shadows.glass,
  },
  elevated: {
    backgroundColor: Colors.cardSolid,
    borderColor: Colors.glassStroke,
    ...Theme.shadows.lifted,
  },
  frosted: {
    backgroundColor: Colors.glassBg,
    borderColor: Colors.glassStroke,
    ...Theme.shadows.medium,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: Colors.cardBorder,
  },
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
