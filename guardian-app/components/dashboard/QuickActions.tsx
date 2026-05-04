import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors, Theme } from '../../constants/theme';
import { Navigation, Video, Mic, Phone } from 'lucide-react-native';

const ACTIONS = [
  { label: 'Safe Route', icon: Navigation, color: Colors.purple },
  { label: 'Fake Call', icon: Phone, color: Colors.pink },
  { label: 'Record', icon: Mic, color: Colors.cyan },
  { label: 'Video', icon: Video, color: '#FFB800' },
];

interface Props { onActionPress?: (label: string) => void; }

export default function QuickActions({ onActionPress }: Props) {
  return (
    <View style={styles.grid}>
      {ACTIONS.map(({ label, icon: Icon, color }) => (
        <TouchableOpacity
          key={label}
          style={[styles.btn, { borderColor: color }]}
          onPress={() => onActionPress?.(label)}
        >
          <Icon color={color} size={26} />
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  btn: {
    width: '22%', aspectRatio: 1,
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  label: { color: Colors.white, fontSize: 10, marginTop: 4, textAlign: 'center' },
});
