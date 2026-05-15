import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  PanResponder, 
} from 'react-native';
import { Colors, Theme } from '../../constants/theme';

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
          toValue: 1.08,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
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
          toValue: 0.95,
          useNativeDriver: false,
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
          useNativeDriver: false,
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
    outputRange: ['rgba(166, 68, 82, 0.1)', Colors.danger]
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.pulseRing, 
          { 
            width: size * 1.25, 
            height: size * 1.25, 
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
        <Text style={styles.text}>
          SOS
        </Text>
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
    backgroundColor: 'rgba(166, 68, 82, 0.12)',
  },
  button: {
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  text: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.trueWhite,
    letterSpacing: 2,
  },
  subtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 1,
  },
});
