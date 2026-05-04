import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../../constants/theme';
import GlowText from '../ui/GlowText';

import { useLocation } from '../../hooks/useLocation';

const getMapHtml = (lat: number, lng: number) => `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    body { margin:0; background:#050505; }
    #map { width:100vw; height:100vh; }
    path.leaflet-interactive { stroke:#7B2FF7; stroke-width:5; filter:drop-shadow(0 0 6px #7B2FF7); }
  </style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var map = L.map('map',{zoomControl:false}).setView([${lat}, ${lng}], 15);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:20}).addTo(map);
  var icon = L.divIcon({html:'<div style="background:#00E5C3;width:14px;height:14px;border-radius:50%;box-shadow:0 0 12px #00E5C3;border:2px solid white;"></div>',className:'',iconSize:[14,14]});
  L.marker([${lat}, ${lng}],{icon}).addTo(map);
  
  // Mock polyline and circles for now, could be dynamic later
  L.polyline([[${lat}, ${lng}],[${lat + 0.001}, ${lng + 0.001}],[${lat + 0.002}, ${lng + 0.003}]]).addTo(map);
  L.circle([${lat + 0.001}, ${lng + 0.001}],{color:'#FF3B3B',fillColor:'#FF3B3B',fillOpacity:0.2,radius:250,weight:0}).addTo(map);
</script>
</body>
</html>`;

export default function SafeRouteMap() {
  const { location } = useLocation();
  const lat = location?.lat ?? 28.6139;
  const lng = location?.lng ?? 77.209;
  const mapHtml = getMapHtml(lat, lng);

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <iframe srcDoc={mapHtml} style={{ width: '100%', height: '100%', border: 'none' } as any} title="Safe Route Map" />
      ) : (
        <WebView source={{ html: mapHtml }} style={{ flex: 1 }} scrollEnabled={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.secondary },
});

