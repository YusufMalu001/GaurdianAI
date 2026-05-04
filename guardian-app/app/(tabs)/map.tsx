import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors, Theme } from '../../constants/theme';
import GlassCard from '../../components/ui/GlassCard';
import GlowText from '../../components/ui/GlowText';
import { MapPin } from 'lucide-react-native';
import { useLocation } from '../../hooks/useLocation';

export default function MapScreen() {
  const { location } = useLocation();
  const lat = location?.lat ?? 28.6139;
  const lng = location?.lng ?? 77.209;

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; background-color: #050505; }
        #map { width: 100vw; height: 100vh; }
        .leaflet-container { background: #050505; }
        path.leaflet-interactive {
          stroke: #7B2FF7;
          stroke-width: 6;
          filter: drop-shadow(0 0 8px #7B2FF7);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], 15);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        var markerHtml = '<div style="background-color: #00E5C3; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 15px #00E5C3; border: 2px solid white;"></div>';
        var customIcon = L.divIcon({ html: markerHtml, className: 'custom-neon-marker', iconSize: [16, 16] });
        L.marker([${lat}, ${lng}], { icon: customIcon }).addTo(map);

        var routeCoords = [
          [${lat}, ${lng}],
          [${lat + 0.001}, ${lng + 0.001}],
          [${lat + 0.002}, ${lng + 0.003}],
          [${lat + 0.003}, ${lng + 0.004}]
        ];
        L.polyline(routeCoords).addTo(map);
        
        L.circle([${lat + 0.002}, ${lng - 0.002}], {
          color: '#FF3B3B',
          fillColor: '#FF3B3B',
          fillOpacity: 0.2,
          radius: 200,
          weight: 0
        }).addTo(map);
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Floating Header */}
        <View style={styles.floatingHeader}>
          <GlassCard style={styles.headerCard}>
            <MapPin color={Colors.purple} size={20} />
            <GlowText style={styles.headerText} color={Colors.white} glowColor={Colors.purple}>
              SAFE ROUTING
            </GlowText>
          </GlassCard>
        </View>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            <iframe 
              srcDoc={mapHtml} 
              style={{ width: '100%', height: '100%', border: 'none' }} 
              title="Safe Route Map"
            />
          ) : (
            <WebView source={{ html: mapHtml }} style={{ flex: 1 }} scrollEnabled={false} />
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
  container: {
    flex: 1,
    position: 'relative',
  },
  floatingHeader: {
    position: 'absolute',
    top: Theme.spacing.xl,
    left: Theme.spacing.lg,
    right: Theme.spacing.lg,
    zIndex: 10,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  headerText: {
    marginLeft: Theme.spacing.md,
    fontSize: Theme.typography.sizes.md,
    letterSpacing: 2,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
});
