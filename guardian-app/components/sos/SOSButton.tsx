import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  PanResponder, 
  Dimensions 
} from 'react-native';
import { Colors, Theme } from '../../constants/theme';
import GlowText from '../ui/GlowText';

interface SOSButtonProps {
  onTrigger: () => void;
  size?: number;
}

export default function SOSButton({ onTrigger, size = 160 }: SOSButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Pulse effect when idle
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Shrink button slightly
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          useNativeDriver: true,
        }).start();

        // Start filling the progress ring
        Animated.timing(progressAnim, {
          toValue: 100,
          duration: 3000, // 3 seconds hold to trigger
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (finished) {
            onTrigger();
            // Reset after trigger
            Animated.timing(progressAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start();
          }
        });
      },
      onPanResponderRelease: () => {
        // Cancel everything
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // For the progress circle outline
  const borderColor = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['rgba(255, 59, 59, 0.2)', Colors.danger]
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.pulseRing, 
          { 
            width: size * 1.3, 
            height: size * 1.3, 
            transform: [{ scale: pulseAnim }] 
          }
        ]} 
      />
      
      <Animated.View 
        {...panResponder.panHandlers}
        style={[
          styles.button, 
          { 
            width: size, 
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: scaleAnim }],
            borderColor: borderColor,
          }
        ]}
      >
        <GlowText style={styles.text} color={Colors.white} glowColor={Colors.danger}>
          SOS
        </GlowText>
        <Text style={styles.subtext}>HOLD 3s</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 59, 59, 0.1)',
  },
  button: {
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  text: {
    fontSize: 42,
    letterSpacing: 2,
  },
  subtext: {
    color: Colors.white60,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 1,
  },
});
