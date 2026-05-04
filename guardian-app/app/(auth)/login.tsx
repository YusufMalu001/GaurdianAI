import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  SafeAreaView, 
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Theme } from '../../constants/theme';
import ActionButton from '../../components/ui/ActionButton';
import GlowText from '../../components/ui/GlowText';
import { Shield, Fingerprint } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();
  const { setProfile, setContacts } = useUserStore();

  const handleLogin = () => {
    // Derive display name from email (e.g. "sarah@gmail.com" → "Sarah")
    const displayName = email
      ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
      : 'User';

    const userData = {
      id: 'usr_' + Date.now(),
      name: displayName,
      email: email || 'user@guardian.app',
      phone: ''
    };

    const profileData = {
      name: displayName,
      email: email || 'user@guardian.app',
      phone: '',
      totalTrips: 0,
      safeMiles: 0
    };

    // Hydrate stores with user-entered data
    login(userData, 'token_' + Date.now());
    setProfile(profileData);
    setContacts([]); // No contacts until user adds them

    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Shield color={Colors.cyan} size={60} strokeWidth={1.5} />
          <GlowText style={styles.title} color={Colors.white} glowColor={Colors.cyan}>
            WELCOME BACK
          </GlowText>
          <Text style={styles.subtitle}>Sign in to continue your secure journey</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>EMAIL OR PHONE</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput 
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.white60}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <ActionButton 
            title="SYSTEM OVERRIDE / LOGIN" 
            onPress={handleLogin} 
            style={styles.loginBtn}
          />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.biometricBtn} onPress={handleLogin}>
            <Fingerprint color={Colors.purple} size={24} />
            <Text style={styles.biometricText}>Login with Biometrics</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <GlowText color={Colors.cyan} glowColor={Colors.cyan}>REGISTER</GlowText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    padding: Theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    marginTop: Theme.spacing.lg,
    letterSpacing: 2,
  },
  subtitle: {
    color: Colors.white60,
    fontSize: Theme.typography.sizes.sm,
    marginTop: Theme.spacing.sm,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: Theme.spacing.lg,
  },
  label: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Theme.spacing.sm,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: Theme.borderRadius.md,
    color: Colors.white,
    padding: Theme.spacing.md,
    fontSize: Theme.typography.sizes.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Theme.spacing.xl,
  },
  forgotText: {
    color: Colors.white60,
    fontSize: Theme.typography.sizes.sm,
  },
  loginBtn: {
    marginBottom: Theme.spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: Colors.white60,
    paddingHorizontal: Theme.spacing.md,
    fontSize: 12,
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.purple,
    borderRadius: Theme.borderRadius.pill,
    padding: Theme.spacing.md,
  },
  biometricText: {
    color: Colors.white,
    marginLeft: Theme.spacing.sm,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Theme.spacing.xxl,
  },
  footerText: {
    color: Colors.white60,
  },
});
