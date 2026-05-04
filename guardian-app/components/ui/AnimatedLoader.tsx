import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { Shield } from 'lucide-react-native';
import { Colors } from '../../constants/theme';

interface AnimatedLoaderProps {
  style?: ViewStyle;
  color?: string;
  size?: number;
}

export default function AnimatedLoader({ 
  style, 
  color = Colors.cyan, 
  size = 40 
}: AnimatedLoaderProps) {
  const pulseAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={[
        { transform: [{ scale: pulseAnim }] }, 
        { shadowColor: color, shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 } },
        style
      ]}
    >
      <Shield color={color} size={size} strokeWidth={2} />
    </Animated.View>
  );
}
