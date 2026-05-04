import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Colors, Theme } from '../../constants/theme';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function NeonButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  style, 
  textStyle,
  icon
}: NeonButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
          shadow: Theme.shadows.neonPink,
        };
      case 'danger':
        return {
          container: styles.dangerContainer,
          text: styles.dangerText,
          shadow: { ...Theme.shadows.neonPink, shadowColor: Colors.danger },
        };
      default:
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
          shadow: Theme.shadows.neonPurple,
        };
    }
  };

  const currentVariant = getVariantStyles();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[styles.button, currentVariant.container, currentVariant.shadow]}
      >
        {icon && <Animated.View style={styles.iconContainer}>{icon}</Animated.View>}
        <Text style={[styles.text, currentVariant.text, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.pill,
    minHeight: 56,
  },
  primaryContainer: {
    backgroundColor: Colors.purple,
    borderWidth: 1,
    borderColor: Colors.glowPurple,
  },
  secondaryContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.pink,
  },
  dangerContainer: {
    backgroundColor: Colors.danger,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 59, 0.5)',
  },
  text: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.pink,
  },
  dangerText: {
    color: Colors.white,
  },
  iconContainer: {
    marginRight: Theme.spacing.sm,
  },
});
