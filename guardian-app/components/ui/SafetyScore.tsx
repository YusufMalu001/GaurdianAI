import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Theme } from '../../constants/theme';
import GlowText from './GlowText';

interface SafetyScoreProps {
  score: number;
  size?: number;
}

export default function SafetyScore({ score, size = 120 }: SafetyScoreProps) {
  const animatedScore = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: score,
      duration: 1500,
      useNativeDriver: false, // Cannot use native driver for text changes/color interpolation easily without Reanimated
    }).start();
  }, [score]);

  const getColor = (s: number) => {
    if (s >= 80) return Colors.success;
    if (s >= 50) return '#FFB800'; // Warning Yellow
    return Colors.danger;
  };

  const scoreColor = getColor(score);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.innerCircle, { borderColor: scoreColor, shadowColor: scoreColor }]}>
        <GlowText style={styles.scoreText} color={scoreColor} glowColor={scoreColor}>
          {score}
        </GlowText>
        <GlowText style={styles.label} color={Colors.white60} glowColor="transparent">
          SAFE
        </GlowText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  innerCircle: {
    width: '85%',
    height: '85%',
    borderRadius: 999,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  scoreText: {
    fontSize: 32,
    lineHeight: 38,
  },
  label: {
    fontSize: 10,
    letterSpacing: 2,
    marginTop: -2,
  },
});
