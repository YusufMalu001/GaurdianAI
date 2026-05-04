import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  ViewStyle, 
  TextStyle,
  StyleProp
} from 'react-native';
import { Colors, Theme } from '../../constants/theme';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  layout?: 'horizontal' | 'vertical';
}

export default function ActionButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  style, 
  buttonStyle,
  textStyle,
  icon,
  layout = 'horizontal'
}: ActionButtonProps) {
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
        };
      case 'danger':
        return {
          container: styles.dangerContainer,
          text: styles.dangerText,
        };
      default:
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
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
        style={[
          styles.button, 
          layout === 'vertical' && styles.verticalButton,
          currentVariant.container, 
          buttonStyle
        ]}
      >
        {icon && (
          <Animated.View style={layout === 'vertical' ? styles.iconContainerVertical : styles.iconContainer}>
            {icon}
          </Animated.View>
        )}
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
    borderRadius: Theme.borderRadius.md,
    minHeight: 56,
  },
  primaryContainer: {
    backgroundColor: Colors.purple,
  },
  secondaryContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  dangerContainer: {
    backgroundColor: Colors.danger,
  },
  text: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  dangerText: {
    color: Colors.white,
  },
  iconContainer: {
    marginRight: Theme.spacing.sm,
  },
  iconContainerVertical: {
    marginBottom: Theme.spacing.sm,
  },
  verticalButton: {
    flexDirection: 'column',
  },
});
