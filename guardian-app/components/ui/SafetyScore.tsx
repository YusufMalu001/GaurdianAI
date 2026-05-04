import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Colors, Theme } from '../../constants/theme';

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
      useNativeDriver: false,
    }).start();
  }, [score]);

  const getColor = (s: number) => {
    if (s >= 80) return Colors.success;
    if (s >= 50) return '#F59E0B'; // Soft Warning Yellow
    return Colors.danger;
  };

  const scoreColor = getColor(score);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.innerCircle, { borderColor: scoreColor }]}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>
          {score}
        </Text>
        <Text style={styles.label}>
          SCORE
        </Text>
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
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  innerCircle: {
    width: '85%',
    height: '85%',
    borderRadius: 999,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 10,
    letterSpacing: 1,
    color: Colors.white60,
    marginTop: 4,
  },
});
