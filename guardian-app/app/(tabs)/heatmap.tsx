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
import { SIMULATED_ZONES } from '../../constants/simulatedZones';

const getHeatmapHtml = (lat: number, lng: number, zones: any[]) => {
  const circles = zones.map(zone => {
    return `L.circle([${zone.center_latitude}, ${zone.center_longitude}], {color:'${zone.color}', fillColor:'${zone.color}', fillOpacity:0.4, radius:${zone.radius}, weight:2}).addTo(map)
    .bindPopup("<b>Zone: ${zone.zone_id}</b><br>Risk: ${zone.risk_level}<br>Crime: ${zone.dominant_crime_type}<br>Active: ${zone.active_time_range}");`;
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
  // Using the simulated zones
  const zones = SIMULATED_ZONES;
  
  // Center map on Indore to showcase the simulated zones if actual location is far away,
  // or use the user's location if they are in Indore. For demo purposes, we'll force Indore.
  const lat = 22.7196; 
  const lng = 75.8577;

  const heatmapHtml = getHeatmapHtml(lat, lng, zones);

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
        <Text style={styles.sectionTitle}>ACTIVE SAFETY ZONES</Text>
        {zones.map(zone => (
          <GlassCard key={zone.zone_id} style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.badge, { borderColor: zone.color }]}>
                <Text style={[styles.badgeText, { color: zone.color }]}>{zone.risk_level}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.incType}>{zone.dominant_crime_type}</Text>
                <Text style={styles.incMeta}>{zone.total_reports} Reports · Active {zone.active_time_range}</Text>
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
