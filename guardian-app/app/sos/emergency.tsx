import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { Colors, Theme } from '../../constants/theme';
import SOSButton from '../../components/sos/SOSButton';
import GlowText from '../../components/ui/GlowText';
import { X, Mic, Video, Navigation, ShieldAlert } from 'lucide-react-native';
import { emergencyApi } from '../../services/api/emergencyApi';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useLocation } from '../../hooks/useLocation';

export default function EmergencyScreen() {
  const [triggered, setTriggered] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [alertId, setAlertId] = useState<string | null>(null);
  const { user, token } = useAuthStore();
  const { trustedContacts } = useUserStore();
  const { location } = useLocation();

  const handleTrigger = () => {
    setTriggered(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (triggered && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }

    // When countdown reaches 0, fire the real API call
    if (triggered && countdown === 0 && !alertId) {
      const lat = location?.lat ?? 28.6139;
      const lng = location?.lng ?? 77.209;
      emergencyApi.trigger(user?.id ?? 'unknown', lat, lng, token ?? '')
        .then(res => {
          setAlertId(res.alert?.id);
          // Notify trusted contacts
          const contactIds = trustedContacts.map(c => c.id);
          if (contactIds.length > 0 && res.alert?.id) {
            emergencyApi.notifyContacts(contactIds, res.alert.id, token ?? '');
          }
        })
        .catch(err => console.error('SOS trigger failed:', err));
    }

    return () => clearTimeout(timer);
  }, [triggered, countdown]);

  return (
    <SafeAreaView style={[styles.safeArea, triggered && styles.triggeredBg]}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeBtn} 
            onPress={() => router.back()}
            disabled={triggered && countdown === 0}
          >
            <X color={Colors.white} size={32} />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {triggered ? (
            <View style={styles.activeState}>
              <ShieldAlert color={Colors.white} size={80} style={styles.alertIcon} />
              <GlowText style={styles.activeTitle} color={Colors.white} glowColor={Colors.danger}>
                EMERGENCY ALERT ACTIVE
              </GlowText>
              
              {countdown > 0 ? (
                <>
                  <Text style={styles.desc}>Dispatching authorities in...</Text>
                  <Text style={styles.countdown}>{countdown}</Text>
                  <TouchableOpacity 
                    style={styles.cancelBtn}
                    onPress={() => {
                      if (alertId) {
                        emergencyApi.cancel(alertId, token ?? '').catch(console.error);
                      }
                      setTriggered(false);
                      setCountdown(5);
                      setAlertId(null);
                    }}
                  >
                    <Text style={styles.cancelText}>CANCEL ALARM</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.desc}>Live location & audio sharing with Police and Trusted Contacts is ACTIVE.</Text>
                  <View style={styles.streamingIndicators}>
                    <View style={styles.streamPill}>
                      <Mic color={Colors.white} size={16} />
                      <Text style={styles.streamText}>AUDIO REC</Text>
                      <View style={[styles.dot, { backgroundColor: Colors.danger }]} />
                    </View>
                    <View style={styles.streamPill}>
                      <Navigation color={Colors.white} size={16} />
                      <Text style={styles.streamText}>LOCATION</Text>
                      <View style={[styles.dot, { backgroundColor: Colors.success }]} />
                    </View>
                  </View>
                </>
              )}
            </View>
          ) : (
            <View style={styles.idleState}>
              <GlowText style={styles.title} color={Colors.white} glowColor={Colors.danger}>
                EMERGENCY
              </GlowText>
              <Text style={styles.desc}>Press and hold to instantly alert authorities and trusted contacts.</Text>
              
              <View style={styles.buttonWrapper}>
                <SOSButton onTrigger={handleTrigger} size={200} />
              </View>
            </View>
          )}
        </View>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 5, 0.95)',
  },
  triggeredBg: {
    backgroundColor: '#300b0b', // Deep red
  },
  container: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  header: {
    alignItems: 'flex-end',
    paddingTop: Theme.spacing.md,
  },
  closeBtn: {
    padding: Theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Theme.borderRadius.pill,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  idleState: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 48,
    letterSpacing: 4,
    marginBottom: Theme.spacing.md,
  },
  desc: {
    color: Colors.white60,
    fontSize: Theme.typography.sizes.md,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.xl,
    lineHeight: 24,
    marginBottom: 60,
  },
  buttonWrapper: {
    marginTop: 20,
  },
  activeState: {
    alignItems: 'center',
    width: '100%',
  },
  alertIcon: {
    marginBottom: Theme.spacing.xl,
  },
  activeTitle: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  countdown: {
    fontSize: 80,
    fontWeight: '800',
    color: Colors.white,
    marginVertical: Theme.spacing.xl,
    textShadowColor: Colors.danger,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  cancelBtn: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: Theme.borderRadius.pill,
  },
  cancelText: {
    color: Colors.white,
    fontWeight: '700',
    letterSpacing: 2,
  },
  streamingIndicators: {
    flexDirection: 'row',
    marginTop: Theme.spacing.xl,
    gap: Theme.spacing.md,
  },
  streamPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  streamText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  }
});
