import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Theme } from '../../constants/theme';
import ActionButton from '../../components/ui/ActionButton';
import GlowText from '../../components/ui/GlowText';
import { ShieldPlus } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { authApi } from '../../services/api/authApi';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();
  const { setProfile, setContacts } = useUserStore();

  const handleRegister = async () => {
    if (!name || !email || !password || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await authApi.register(name, email, phone, password);
      login(response.user, response.token);
      setProfile({
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        totalTrips: 0,
        safeMiles: 0,
      });
      setContacts([]);

      router.replace('/(tabs)/home');
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ShieldPlus color={Colors.purple} size={60} strokeWidth={1.5} />
            <GlowText style={styles.title} color={Colors.white} glowColor={Colors.pink}>
              JOIN GUARDIAN
            </GlowText>
            <Text style={styles.subtitle}>Create your secure profile</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={Colors.white60}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMAIL</Text>
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
              <Text style={styles.label}>EMERGENCY PHONE</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor={Colors.white60}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.white60}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <ActionButton
              title={submitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              onPress={handleRegister}
              variant="secondary"
              style={styles.registerBtn}
            />

            {submitting ? <ActivityIndicator color={Colors.teal} style={styles.loader} /> : null}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <GlowText color={Colors.pink} glowColor={Colors.pink}>LOGIN</GlowText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  },
  scrollContent: {
    padding: Theme.spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
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
    marginBottom: Theme.spacing.md,
  },
  label: {
    color: Colors.purple,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Theme.spacing.sm,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: Theme.borderRadius.md,
    color: Colors.white,
    padding: Theme.spacing.md,
    fontSize: Theme.typography.sizes.md,
  },
  errorText: {
    color: Colors.danger,
    fontSize: Theme.typography.sizes.sm,
    marginBottom: Theme.spacing.md,
  },
  registerBtn: {
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  loader: {
    marginBottom: Theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: Theme.spacing.xl,
  },
  footerText: {
    color: Colors.white60,
  },
});
