import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { Colors, Theme } from '../../constants/theme';
import { Shield } from 'lucide-react-native';

interface Props {
  name: string;
  hour?: number;
}

export default function GreetingCard({ name, hour = new Date().getHours() }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const emoji = hour < 12 ? '☀️' : hour < 18 ? '🌤️' : '🌙';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, {
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
    }]}>
      <View style={styles.avatarRing}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.greet}>{greeting} {emoji}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 2,
    marginRight: Theme.spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.textOnAccent,
    fontSize: 18,
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
  },
  greet: {
    color: Colors.textSecondary,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: '500',
    marginBottom: 2,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: Theme.typography.sizes.xl,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
