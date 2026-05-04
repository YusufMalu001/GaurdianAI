import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Theme } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'glowPurple' | 'glowCyan';
}

export default function GlassCard({ children, style, variant = 'default' }: GlassCardProps) {
  
  const getGlowStyle = () => {
    switch (variant) {
      case 'glowPurple':
        return {
          borderColor: Colors.glowPurple,
          shadowColor: Colors.purple,
          shadowOpacity: 0.3,
          shadowRadius: 15,
        };
      case 'glowCyan':
        return {
          borderColor: Colors.glowCyan,
          shadowColor: Colors.cyan,
          shadowOpacity: 0.3,
          shadowRadius: 15,
        };
      default:
        return {
          borderColor: 'rgba(255,255,255,0.1)',
        };
    }
  };

  return (
    <View style={[styles.card, getGlowStyle(), Theme.shadows.glass, style]}>
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
    backdropFilter: 'blur(10px)', // Note: backdropFilter is primarily web-only, on native it relies on backgroundColor opacity
    overflow: 'hidden',
  },
});
