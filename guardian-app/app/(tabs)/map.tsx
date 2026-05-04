import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors, Theme } from '../../constants/theme';
import GlassCard from '../../components/ui/GlassCard';
import GlassInput from '../../components/ui/GlassInput';
import { MapPin, Search, Navigation, LocateFixed } from 'lucide-react-native';
import { useLocation } from '../../hooks/useLocation';

export default function MapScreen() {
  const { location } = useLocation();
  const [destination, setDestination] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const lat = location?.lat ?? 28.6139;
  const lng = location?.lng ?? 77.209;

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; background-color: #0F172A; }
        #map { width: 100vw; height: 100vh; }
        .leaflet-container { background: #0F172A; }
        path.leaflet-interactive.safe-route {
          stroke: #14B8A6;
          stroke-width: 5;
          filter: drop-shadow(0 0 4px rgba(20, 184, 166, 0.4));
        }
        path.leaflet-interactive.fast-route {
          stroke: #6D28D9;
          stroke-width: 4;
          stroke-dasharray: 10, 10;
          opacity: 0.8;
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

        var markerHtml = '<div style="background-color: #10B981; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); border: 2px solid white;"></div>';
        var customIcon = L.divIcon({ html: markerHtml, className: 'custom-soft-marker', iconSize: [16, 16] });
        L.marker([${lat}, ${lng}], { icon: customIcon }).addTo(map);

        // Danger Zone
        L.circle([${lat + 0.003}, ${lng + 0.002}], {
          color: 'transparent',
          fillColor: '#EF4444',
          fillOpacity: 0.2,
          radius: 300,
          weight: 0
        }).addTo(map);

        ${isNavigating ? `
          // Destination Marker
          var destMarkerHtml = '<div style="background-color: #6D28D9; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 10px rgba(109, 40, 217, 0.5); border: 2px solid white;"></div>';
          var destIcon = L.divIcon({ html: destMarkerHtml, className: 'custom-soft-marker', iconSize: [16, 16] });
          L.marker([${lat + 0.008}, ${lng + 0.005}], { icon: destIcon }).addTo(map);

          // Fast Route (Direct, but goes through danger zone)
          var fastRouteCoords = [
            [${lat}, ${lng}],
            [${lat + 0.002}, ${lng + 0.001}],
            [${lat + 0.004}, ${lng + 0.002}], // Inside danger zone
            [${lat + 0.006}, ${lng + 0.004}],
            [${lat + 0.008}, ${lng + 0.005}]
          ];
          L.polyline(fastRouteCoords, { className: 'fast-route' }).addTo(map);

          // Safe Route (Curved around danger zone)
          var safeRouteCoords = [
            [${lat}, ${lng}],
            [${lat + 0.001}, ${lng + 0.005}],
            [${lat + 0.004}, ${lng + 0.007}], // Bypassing danger zone
            [${lat + 0.007}, ${lng + 0.006}],
            [${lat + 0.008}, ${lng + 0.005}]
          ];
          L.polyline(safeRouteCoords, { className: 'safe-route' }).addTo(map);
          
          // Adjust bounds to fit both routes
          map.fitBounds(L.polyline(safeRouteCoords).getBounds(), { padding: [50, 50] });
        ` : `
          // Idle state route (just a small trail)
          var routeCoords = [
            [${lat}, ${lng}],
            [${lat - 0.001}, ${lng - 0.001}],
            [${lat - 0.002}, ${lng - 0.003}],
            [${lat - 0.003}, ${lng - 0.004}]
          ];
          L.polyline(routeCoords, { className: 'safe-route' }).addTo(map);
        `}
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Floating Header */}
        <View style={styles.floatingHeader}>
          {!isNavigating ? (
            <GlassInput
              placeholder="Where do you want to go?"
              icon={<Search color={Colors.teal} size={20} />}
              value={destination}
              onChangeText={setDestination}
              onSubmitEditing={() => setIsNavigating(true)}
              returnKeyType="search"
            />
          ) : (
            <GlassCard style={styles.headerCard}>
              <TouchableOpacity onPress={() => setIsNavigating(false)} style={{ padding: 4 }}>
                <Text style={{ color: Colors.white60, fontSize: 18 }}>{'<'}</Text>
              </TouchableOpacity>
              <MapPin color={Colors.teal} size={20} style={{ marginLeft: Theme.spacing.md }} />
              <Text style={styles.headerText} numberOfLines={1}>
                {destination || "Unknown Destination"}
              </Text>
            </GlassCard>
          )}
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
            <WebView ref={webViewRef} source={{ html: mapHtml }} style={{ flex: 1 }} scrollEnabled={false} />
          )}

          {/* My Location Button */}
          <TouchableOpacity 
            style={[styles.myLocationBtn, { bottom: isNavigating ? 320 : Theme.spacing.xl }]}
            onPress={() => {
              const script = `map.setView([${lat}, ${lng}], 15); true;`;
              if (Platform.OS !== 'web') {
                webViewRef.current?.injectJavaScript(script);
              }
            }}
          >
            <LocateFixed color={Colors.teal} size={24} />
          </TouchableOpacity>
        </View>

        {/* Navigation Info Panel */}
        {isNavigating && (
          <View style={styles.floatingBottom}>
            <GlassCard style={styles.infoCard}>
              <View style={styles.routeOption}>
                <View style={styles.routeHeader}>
                  <View style={[styles.routeColorDot, { backgroundColor: Colors.teal }]} />
                  <Text style={styles.routeTitle}>Safe Route (Recommended)</Text>
                  <Text style={styles.routeEta}>14 min</Text>
                </View>
                <Text style={styles.routeDesc}>Avoids 1 reported danger zone</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.routeOption}>
                <View style={styles.routeHeader}>
                  <View style={[styles.routeColorDot, { backgroundColor: Colors.purple }]} />
                  <Text style={styles.routeTitle}>Fast Route</Text>
                  <Text style={styles.routeEta}>10 min</Text>
                </View>
                <Text style={styles.routeDesc}>Direct path, passes near unlit areas</Text>
              </View>

              <TouchableOpacity style={styles.startNavBtn}>
                <Navigation color={Colors.white} size={20} />
                <Text style={styles.startNavText}>START SAFE ROUTE</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        )}

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
    color: Colors.white,
    letterSpacing: 2,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  myLocationBtn: {
    position: 'absolute',
    right: Theme.spacing.lg,
    backgroundColor: Colors.card,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 20,
  },
  floatingBottom: {
    position: 'absolute',
    bottom: Theme.spacing.xl,
    left: Theme.spacing.lg,
    right: Theme.spacing.lg,
    zIndex: 10,
  },
  infoCard: {
    padding: Theme.spacing.md,
  },
  routeOption: {
    marginVertical: Theme.spacing.sm,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Theme.spacing.sm,
  },
  routeTitle: {
    flex: 1,
    color: Colors.white,
    fontSize: Theme.typography.sizes.md,
    fontWeight: '600',
  },
  routeEta: {
    color: Colors.white,
    fontSize: Theme.typography.sizes.md,
    fontWeight: '700',
  },
  routeDesc: {
    color: Colors.white60,
    fontSize: 12,
    marginLeft: 20,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: Theme.spacing.sm,
  },
  startNavBtn: {
    backgroundColor: Colors.teal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginTop: Theme.spacing.md,
  },
  startNavText: {
    color: Colors.white,
    fontWeight: '700',
    marginLeft: Theme.spacing.sm,
    letterSpacing: 1,
  },
});
