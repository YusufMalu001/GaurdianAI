import React from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Theme } from '../../constants/theme';
import NeonButton from '../../components/ui/NeonButton';
import GlowText from '../../components/ui/GlowText';
import { Map } from 'lucide-react-native';

export default function OnboardingScreen2() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <Map color={Colors.purple} size={100} strokeWidth={1} />
          </View>
          
          <GlowText style={styles.title} color={Colors.white} glowColor={Colors.purple}>
            NEVER WALK ALONE
          </GlowText>
          
          <Text style={styles.description}>
            Live heatmap navigation guides you through the safest streets. Trusted contacts track you in real-time.
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
          
          <View style={styles.buttons}>
            <NeonButton 
              title="BACK" 
              variant="secondary"
              style={{ flex: 1, marginRight: Theme.spacing.md }}
              onPress={() => router.back()} 
            />
            <NeonButton 
              title="NEXT" 
              style={{ flex: 1 }}
              onPress={() => router.push('/onboarding/screen3')} 
            />
          </View>
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
  container: {
    flex: 1,
    padding: Theme.spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: Theme.spacing.xxl,
    shadowColor: Colors.purple,
    shadowOpacity: 0.8,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
    letterSpacing: 2,
  },
  description: {
    color: Colors.white60,
    fontSize: Theme.typography.sizes.md,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Theme.spacing.md,
  },
  footer: {
    paddingBottom: Theme.spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Theme.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white60,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.purple,
    shadowColor: Colors.purple,
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  buttons: {
    flexDirection: 'row',
  }
});
