import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle, StyleProp } from 'react-native';
import { Colors, Theme } from '../../constants/theme';

interface GlassInputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function GlassInput({ icon, containerStyle, style, ...props }: GlassInputProps) {
  return (
    <View style={[styles.container, Theme.shadows.glass, containerStyle]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.white60}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: Theme.spacing.md,
    height: 50,
  },
  iconContainer: {
    marginRight: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: Theme.typography.sizes.md,
    fontWeight: '500',
  },
});
