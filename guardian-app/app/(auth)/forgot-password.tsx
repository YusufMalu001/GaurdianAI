import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Theme } from '../../constants/theme';
import NeonButton from '../../components/ui/NeonButton';
import GlowText from '../../components/ui/GlowText';
import { Shield, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <ArrowLeft color={Colors.white} size={24} />
        </TouchableOpacity>

        <Shield color={Colors.purple} size={60} style={styles.icon} />
        <GlowText style={styles.title} color={Colors.white} glowColor={Colors.purple}>RESET PASSWORD</GlowText>
        <Text style={styles.desc}>
          {sent
            ? 'A reset link has been sent to your email. Check your inbox.'
            : 'Enter your registered email address and we will send you a secure reset link.'}
        </Text>

        {!sent && (
          <>
            <View style={styles.inputBox}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={Colors.white60}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <NeonButton title="SEND RESET LINK" onPress={() => setSent(true)} style={styles.btn} />
          </>
        )}

        {sent && (
          <NeonButton title="BACK TO LOGIN" variant="secondary" onPress={() => router.replace('/(auth)/login')} style={styles.btn} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { flex: 1, padding: Theme.spacing.lg, justifyContent: 'center', alignItems: 'center' },
  back: { position: 'absolute', top: Theme.spacing.lg, left: Theme.spacing.lg, padding: Theme.spacing.sm },
  icon: { marginBottom: Theme.spacing.lg },
  title: { fontSize: Theme.typography.sizes.xl, letterSpacing: 2, marginBottom: Theme.spacing.md },
  desc: { color: Colors.white60, textAlign: 'center', fontSize: 14, lineHeight: 22, marginBottom: Theme.spacing.xxl, paddingHorizontal: Theme.spacing.md },
  inputBox: { width: '100%', marginBottom: Theme.spacing.lg },
  label: { color: Colors.purple, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: Theme.spacing.sm },
  input: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: Theme.borderRadius.md, color: Colors.white,
    padding: Theme.spacing.md, fontSize: Theme.typography.sizes.md,
  },
  btn: { width: '100%' },
});
