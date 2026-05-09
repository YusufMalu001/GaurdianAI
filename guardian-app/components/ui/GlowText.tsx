import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors, Theme } from '../../constants/theme';

interface GlowTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  color?: string;
  glowColor?: string;
}

export default function GlowText({ 
  children, 
  style, 
  color = Colors.white, 
  glowColor = Colors.cyan 
}: GlowTextProps) {
  return (
    <Text 
      style={[
        styles.text, 
        { 
          color, 
          textShadowColor: glowColor,
        }, 
        style
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Theme.typography.fontFamily.bold,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
