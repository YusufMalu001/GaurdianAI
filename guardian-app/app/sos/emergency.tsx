import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import { Colors, Theme } from '../../constants/theme';
import SOSButton from '../../components/sos/SOSButton';
import ActionButton from '../../components/ui/ActionButton';
import { X, Mic, Navigation, ShieldAlert } from 'lucide-react-native';
import { emergencyApi } from '../../services/api/emergencyApi';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useLocation } from '../../hooks/useLocation';

export default function EmergencyScreen() {
  const [triggered, setTriggered] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [alertId, setAlertId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuthStore();
  const { trustedContacts } = useUserStore();
  const { location } = useLocation();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(newRecording);
    } catch (recordingError) {
      console.error('Failed to start recording', recordingError);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } catch (recordingError) {
      console.error('Failed to stop recording', recordingError);
    }

    setRecording(null);
  }

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(console.error);
      }
    };
  }, [recording]);

  const handleTrigger = () => {
    setError(null);
    setTriggered(true);
  };

  const resetEmergencyState = () => {
    stopRecording();
    setTriggered(false);
    setCountdown(5);
    setAlertId(null);
    setSubmitting(false);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (triggered && countdown > 0) {
      timer = setTimeout(() => setCountdown((current) => current - 1), 1000);
    }

    if (triggered && countdown === 0 && !alertId && !submitting) {
      if (!user?.id || !token) {
        setError('Please log in before triggering SOS.');
        resetEmergencyState();
        return;
      }

      setSubmitting(true);
      startRecording();

      const lat = location?.lat ?? 28.6139;
      const lng = location?.lng ?? 77.209;

      emergencyApi
        .trigger(user.id, lat, lng, token)
        .then(async (response) => {
          setAlertId(response.alert.id);

          const contactIds = trustedContacts.map((contact) => contact.id);
          if (contactIds.length > 0) {
            await emergencyApi.notifyContacts(contactIds, response.alert.id, token);
          }
        })
        .catch((apiError) => {
          setError(apiError instanceof Error ? apiError.message : 'SOS trigger failed');
          resetEmergencyState();
        })
        .finally(() => setSubmitting(false));
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [alertId, countdown, location?.lat, location?.lng, submitting, token, triggered, trustedContacts, user?.id]);

  return (
    <SafeAreaView style={[styles.safeArea, triggered && styles.triggeredBg]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}
            disabled={triggered && countdown === 0}
          >
            <X color={triggered ? Colors.trueWhite : Colors.white} size={32} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {triggered ? (
            <View style={styles.activeState}>
              <ShieldAlert color={Colors.trueWhite} size={80} style={styles.alertIcon} />
              <Text style={styles.activeTitle}>EMERGENCY ALERT ACTIVE</Text>

              {countdown > 0 ? (
                <>
                  <Text style={styles.desc}>Dispatching authorities in...</Text>
                  <Text style={styles.countdown}>{countdown}</Text>
                  <ActionButton
                    title="CANCEL ALARM"
                    variant="secondary"
                    onPress={() => {
                      if (alertId && token) {
                        emergencyApi.cancel(alertId, token).catch(console.error);
                      }
                      resetEmergencyState();
                    }}
                    buttonStyle={styles.cancelBtn}
                    textStyle={styles.cancelText}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.reassuringText}>Help is being alerted.</Text>
                  <Text style={styles.desc}>
                    Live location and audio sharing with Police and {trustedContacts.map((contact) => contact.name).join(', ') || 'Trusted Contacts'} is active.
                  </Text>
                  {submitting ? <ActivityIndicator color={Colors.trueWhite} style={styles.loader} /> : null}
                  <View style={styles.streamingIndicators}>
                    <View style={styles.streamPill}>
                      <Mic color={Colors.trueWhite} size={16} />
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

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          ) : (
            <View style={styles.idleState}>
              <Text style={styles.title}>EMERGENCY</Text>
              <Text style={styles.desc}>Press and hold to instantly alert authorities and trusted contacts.</Text>
              {error ? <Text style={styles.idleErrorText}>{error}</Text> : null}

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
    backgroundColor: Colors.primary,
  },
  triggeredBg: {
    backgroundColor: '#3E2723',
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
    fontSize: 42,
    fontWeight: '700',
    color: Colors.danger,
    letterSpacing: 2,
    marginBottom: Theme.spacing.md,
  },
  desc: {
    color: Colors.white,
    fontSize: Theme.typography.sizes.md,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.xl,
    lineHeight: 24,
    marginBottom: 40,
  },
  idleErrorText: {
    color: Colors.danger,
    fontSize: Theme.typography.sizes.sm,
    marginBottom: Theme.spacing.lg,
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
    fontSize: 28,
    fontWeight: '700',
    color: Colors.trueWhite,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  countdown: {
    fontSize: 80,
    fontWeight: '800',
    color: Colors.trueWhite,
    marginVertical: Theme.spacing.xl,
  },
  reassuringText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.trueWhite,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  cancelBtn: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.trueWhite,
    borderRadius: Theme.borderRadius.pill,
  },
  cancelText: {
    color: Colors.trueWhite,
    fontWeight: '700',
    letterSpacing: 2,
  },
  loader: {
    marginBottom: Theme.spacing.lg,
  },
  streamingIndicators: {
    flexDirection: 'row',
    marginTop: Theme.spacing.xl,
    gap: Theme.spacing.md,
  },
  streamPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  streamText: {
    color: Colors.trueWhite,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  errorText: {
    color: Colors.trueWhite,
    fontSize: Theme.typography.sizes.sm,
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
  },
});
