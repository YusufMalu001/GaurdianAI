import { useEffect } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';
import { Shield } from 'lucide-react-native';

export default function SplashScreen() {
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding/screen1');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Shield color={Colors.cyan} size={80} strokeWidth={1.5} />
      </Animated.View>
      <Text style={styles.title}>GUARDIAN</Text>
      <Text style={styles.tagline}>AI Women Safety App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 4,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.cyan,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
