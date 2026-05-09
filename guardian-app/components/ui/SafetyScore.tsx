import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Theme } from '../../constants/theme';

interface SafetyScoreProps {
  score: number;
  size?: number;
  label?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function SafetyScore({ score, size = 140, label }: SafetyScoreProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [score]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getStatusInfo = (s: number) => {
    if (s >= 80) return { color1: '#6B8E53', color2: '#8FA968', status: 'Safe Area', textColor: Colors.success };
    if (s >= 50) return { color1: '#C9963A', color2: '#D4AA55', status: 'Moderate', textColor: Colors.warning };
    return { color1: '#C0505F', color2: '#D46B78', status: 'Caution', textColor: Colors.danger };
  };

  const { color1, color2, status, textColor } = getStatusInfo(score);
  const progressOffset = circumference - (score / 100) * circumference;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      {/* Soft glow background */}
      <View style={[styles.glowRing, {
        width: size + 16, height: size + 16, borderRadius: (size + 16) / 2,
        backgroundColor: `${color1}10`,
      }]}>
        {/* SVG Ring */}
        <View style={{ width: size, height: size }}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor={color1} stopOpacity="1" />
                <Stop offset="100%" stopColor={color2} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            {/* Track */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={Colors.secondary}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#scoreGrad)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              transform={`rotate(-90 ${center} ${center})`}
            />
          </Svg>
          {/* Score text overlay */}
          <View style={[styles.centerOverlay, { width: size, height: size }]}>
            <Text style={[styles.scoreText, { color: textColor, fontSize: size * 0.24 }]}>
              {score}
            </Text>
            <Text style={[styles.statusLabel, { color: Colors.textSecondary }]}>
              {label || status}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontWeight: '700',
    letterSpacing: -1,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});
