import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors, Theme } from '../../constants/theme';
import GlassCard from '../../components/ui/GlassCard';
import GlowText from '../../components/ui/GlowText';
import { Flame } from 'lucide-react-native';
import { safetyApi } from '../../services/api/safetyApi';
import { useLocation } from '../../hooks/useLocation';
import { useEffect, useState } from 'react';

const getHeatmapHtml = (lat: number, lng: number, incidents: any[]) => {
  const circles = incidents.map(inc => {
    const color = inc.riskLevel === 'HIGH' ? Colors.danger : inc.riskLevel === 'MEDIUM' ? '#D2691E' : Colors.success;
    return `L.circle([${inc.lat}, ${inc.lng}], {color:'${color}', fillColor:'${color}', fillOpacity:0.3, radius:150, weight:1}).addTo(map);`;
  }).join('\n');

  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>body{margin:0;background:${Colors.primary}}#map{width:100vw;height:100vh}</style>
</head><body><div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
var map=L.map('map',{zoomControl:false}).setView([${lat}, ${lng}], 14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:20}).addTo(map);
${circles}
</script></body></html>`;
};

const riskColor = (r: string) => r === 'HIGH' ? Colors.danger : r === 'MEDIUM' ? '#D2691E' : Colors.success;

export default function HeatmapScreen() {
  const { location } = useLocation();
  const [incidents, setIncidents] = useState<any[]>([]);
  const lat = location?.lat ?? 28.6139;
  const lng = location?.lng ?? 77.209;

  useEffect(() => {
    safetyApi.getIncidents(lat, lng, 5000)
      .then(setIncidents)
      .catch(console.error);
  }, [lat, lng]);

  const heatmapHtml = getHeatmapHtml(lat, lng, incidents);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Flame color={Colors.pink} size={22} />
        <GlowText style={styles.title} color={Colors.white} glowColor={Colors.pink}> COMMUNITY HEATMAP</GlowText>
      </View>

      <View style={styles.mapContainer}>
        {Platform.OS === 'web'
          ? <iframe srcDoc={heatmapHtml} style={{ width:'100%', height:'100%', border:'none' } as any} title="Heatmap" />
          : <WebView source={{ html: heatmapHtml }} style={{ flex: 1 }} scrollEnabled={false} />}
      </View>

      <View style={styles.incidents}>
        <Text style={styles.sectionTitle}>RECENT INCIDENTS</Text>
        {incidents.map(inc => (
          <GlassCard key={inc.id} style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.badge, { borderColor: riskColor(inc.riskLevel) }]}>
                <Text style={[styles.badgeText, { color: riskColor(inc.riskLevel) }]}>{inc.riskLevel}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.incType}>{inc.type}</Text>
                <Text style={styles.incMeta}>{inc.description} · {new Date(inc.timestamp).toLocaleTimeString()}</Text>
              </View>
            </View>
          </GlassCard>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  header: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.lg, paddingBottom: Theme.spacing.sm },
  title: { fontSize: 18, letterSpacing: 2 },
  mapContainer: { height: 260, backgroundColor: Colors.secondary },
  incidents: { flex: 1, padding: Theme.spacing.lg },
  sectionTitle: { color: Colors.white60, fontSize: 12, letterSpacing: 2, fontWeight: '700', marginBottom: Theme.spacing.md },
  card: { padding: Theme.spacing.md, marginBottom: Theme.spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  badge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginRight: Theme.spacing.md },
  badgeText: { fontSize: 11, fontWeight: '800' },
  info: { flex: 1 },
  incType: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  incMeta: { color: Colors.white60, fontSize: 12, marginTop: 2 },
});
