import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Theme } from '../../constants/theme';
import GlassCard from '../../components/ui/GlassCard';
import GlowText from '../../components/ui/GlowText';
import { Bell, ShieldAlert, Info, CheckCircle, X } from 'lucide-react-native';
import { useNotifications } from '../../hooks/useNotifications';

const iconFor = (type: string) => {
  if (type === 'alert') return ShieldAlert;
  if (type === 'warning') return Bell;
  if (type === 'success') return CheckCircle;
  return Info;
};

const colorFor = (type: string) => {
  if (type === 'alert') return Colors.danger;
  if (type === 'warning') return '#FFB800';
  if (type === 'success') return Colors.success;
  return Colors.cyan;
};

export default function NotificationsScreen() {
  const { notifications, markRead } = useNotifications();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <GlowText style={styles.heading} color={Colors.white} glowColor={Colors.cyan}>NOTIFICATIONS</GlowText>

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell color={Colors.white60} size={48} />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubText}>Safety alerts and updates will appear here</Text>
          </View>
        ) : (
          notifications.map(n => {
            const Icon = iconFor(n.type);
            const color = colorFor(n.type);
            return (
              <GlassCard key={n.id} style={[styles.card, !n.read && { borderColor: color, borderWidth: 1 }]}>
                <View style={styles.row}>
                  <Icon color={color} size={20} />
                  <View style={styles.content}>
                    <Text style={styles.title}>{n.title}</Text>
                    <Text style={styles.message}>{n.message}</Text>
                    <Text style={styles.time}>{new Date(n.timestamp).toLocaleTimeString()}</Text>
                  </View>
                  {!n.read && (
                    <TouchableOpacity onPress={() => markRead(n.id)}>
                      <X color={Colors.white60} size={16} />
                    </TouchableOpacity>
                  )}
                </View>
              </GlassCard>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { padding: Theme.spacing.lg, paddingBottom: 100 },
  heading: { fontSize: 22, letterSpacing: 3, marginBottom: Theme.spacing.xl },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyText: { color: Colors.white, fontSize: 18, fontWeight: '700', marginTop: Theme.spacing.lg },
  emptySubText: { color: Colors.white60, fontSize: 14, marginTop: Theme.spacing.sm, textAlign: 'center' },
  card: { padding: Theme.spacing.md, marginBottom: Theme.spacing.sm },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  content: { flex: 1, marginLeft: Theme.spacing.md },
  title: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  message: { color: Colors.white60, fontSize: 13, marginTop: 3, lineHeight: 19 },
  time: { color: Colors.white60, fontSize: 11, marginTop: 4 },
});
