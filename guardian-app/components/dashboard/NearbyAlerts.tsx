import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import GlassCard from '../ui/GlassCard';
import { Colors, Theme } from '../../constants/theme';
import { AlertTriangle, ShieldAlert } from 'lucide-react-native';
import { safetyApi } from '../../services/api/safetyApi';
import { useLocation } from '../../hooks/useLocation';

export default function NearbyAlerts() {
  const { location } = useLocation();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!location) return;
    safetyApi.getIncidents(location.lat, location.lng, 5000)
      .then(res => setAlerts(res.slice(0, 2))) // Only show 2 closest/most recent
      .catch(console.error);
  }, [location]);

  if (alerts.length === 0) return null;

  return (
    <View>
      {alerts.map(alert => (
        <GlassCard key={alert.id} style={styles.card}>
          <View style={styles.row}>
            {alert.riskLevel === 'HIGH' || alert.riskLevel === 'CRITICAL'
              ? <ShieldAlert color={Colors.danger} size={20} />
              : <AlertTriangle color="#FFB800" size={20} />}
            <View style={styles.content}>
              <Text style={styles.message}>{alert.type} reported nearby.</Text>
              <Text style={styles.time}>{new Date(alert.timestamp).toLocaleTimeString()}</Text>
            </View>
          </View>
        </GlassCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Theme.spacing.sm, padding: Theme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  content: { flex: 1, marginLeft: Theme.spacing.md },
  message: { color: Colors.white, fontSize: 14, lineHeight: 20 },
  time: { color: Colors.white60, fontSize: 12, marginTop: 4 },
});
