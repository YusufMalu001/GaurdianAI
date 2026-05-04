import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import GlassCard from '../ui/GlassCard';
import GlowText from '../ui/GlowText';
import { Colors, Theme } from '../../constants/theme';
import { ShieldAlert, X } from 'lucide-react-native';

interface Props {
  visible: boolean;
  countdown: number;
  onCancel: () => void;
}

export default function EmergencyModal({ visible, countdown, onCancel }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <GlassCard style={styles.modal}>
        <ShieldAlert color={Colors.danger} size={48} style={{ alignSelf: 'center' }} />
        <GlowText style={styles.title} color={Colors.white} glowColor={Colors.danger}>
          EMERGENCY ALERT
        </GlowText>
        {countdown > 0 ? (
          <>
            <Text style={styles.desc}>Dispatching in {countdown}s…</Text>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <X color={Colors.white} size={18} />
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.desc}>Emergency services notified. Live tracking active.</Text>
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center', alignItems: 'center', zIndex: 999,
  },
  modal: { width: '85%', alignItems: 'center' },
  title: { fontSize: 24, letterSpacing: 2, textAlign: 'center', marginVertical: Theme.spacing.md },
  desc: { color: Colors.white60, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', marginTop: Theme.spacing.lg,
    borderWidth: 1, borderColor: Colors.white,
    paddingVertical: Theme.spacing.sm, paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.pill,
  },
  cancelText: { color: Colors.white, fontWeight: '700', marginLeft: 6, letterSpacing: 1 },
});
