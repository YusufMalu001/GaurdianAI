import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, Text, TouchableOpacity, ActivityIndicator, FlatList, Keyboard } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors, Theme } from '../../constants/theme';
import GlassCard from '../../components/ui/GlassCard';
import GlassInput from '../../components/ui/GlassInput';
import { MapPin, Search, Navigation, LocateFixed, AlertCircle } from 'lucide-react-native';
import { useLocation } from '../../hooks/useLocation';
import { routeApi, type PlaceResult } from '../../services/api/routeApi';

const STATIC_MAP_HTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      body { margin: 0; padding: 0; background-color: ${Colors.primary}; }
      #map { width: 100vw; height: 100vh; }
      .leaflet-container { background: ${Colors.primary}; }
      .custom-soft-marker {
        transition: all 0.3s ease;
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 229, 195, 0.7); }
        70% { box-shadow: 0 0 0 15px rgba(0, 229, 195, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 229, 195, 0); }
      }
      .pulse-marker {
        background-color: ${Colors.teal};
        width: 16px; height: 16px;
        border-radius: 50%;
        border: 2px solid white;
        animation: pulse 2s infinite;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      var map = L.map('map', { zoomControl: true }).setView([28.6139, 77.209], 15);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      var userMarker, destMarker, routeLayer;
      var userIcon = L.divIcon({ html: '<div class="pulse-marker"></div>', className: 'custom-soft-marker', iconSize: [16, 16] });
      var destIcon = L.divIcon({ html: '<div style="background-color: ${Colors.purple}; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 10px rgba(123, 47, 247, 0.5); border: 2px solid white;"></div>', className: 'custom-soft-marker', iconSize: [16, 16] });

      window.updateLocation = function(lat, lng) {
        if (!userMarker) {
          userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
          map.setView([lat, lng], 15);
        } else {
          userMarker.setLatLng([lat, lng]);
        }
      };

      window.setDestinationMarker = function(lat, lng) {
        if (destMarker) map.removeLayer(destMarker);
        destMarker = L.marker([lat, lng], { icon: destIcon }).addTo(map);
      };

      window.drawRoute = function(geojsonStr) {
        if (routeLayer) map.removeLayer(routeLayer);
        var geojson = JSON.parse(geojsonStr);
        routeLayer = L.geoJSON(geojson, {
          style: { color: '${Colors.teal}', weight: 5, filter: 'drop-shadow(0 0 4px rgba(0, 229, 195, 0.4))' }
        }).addTo(map);

        var bounds = routeLayer.getBounds();
        if (userMarker) bounds.extend(userMarker.getLatLng());
        if (destMarker) bounds.extend(destMarker.getLatLng());
        map.fitBounds(bounds, { padding: [50, 50] });
      };

      window.clearRoute = function() {
        if (routeLayer) map.removeLayer(routeLayer);
        if (destMarker) map.removeLayer(destMarker);
        routeLayer = null;
        destMarker = null;
        if (userMarker) map.setView(userMarker.getLatLng(), 15);
      };

      window.centerOnUser = function() {
        if (userMarker) {
          map.setView(userMarker.getLatLng(), 15);
        }
      };
    </script>
  </body>
  </html>
`;

export default function MapScreen() {
  const { location, loading, error } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedDestName, setSelectedDestName] = useState('');
  const [eta, setEta] = useState('');
  const [distance, setDistance] = useState('');
  const [routeError, setRouteError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapReady && location) {
      const script = `window.updateLocation(${location.lat}, ${location.lng}); true;`;
      webViewRef.current?.injectJavaScript(script);
    }
  }, [location, mapReady]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const results = await routeApi.searchPlaces(searchQuery);
          setSuggestions(results);
        } catch (searchError) {
          console.error('Search failed', searchError);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectPlace = async (place: PlaceResult) => {
    Keyboard.dismiss();
    setSearchQuery('');
    setSuggestions([]);
    setSelectedDestName(place.display_name.split(',')[0]);
    setIsNavigating(true);
    setRouteError(null);

    const destLat = Number(place.lat);
    const destLng = Number(place.lon);

    if (!location) {
      setRouteError('Current location is not available yet.');
      return;
    }

    try {
      const route = await routeApi.getSafeRoute(location.lat, location.lng, destLat, destLng);
      setDistance(`${route.distanceKm} km`);
      setEta(`${route.estimatedTimeMinutes} min`);

      const script = `
        window.setDestinationMarker(${destLat}, ${destLng});
        window.drawRoute('${JSON.stringify(route.geometry)}');
        true;
      `;
      webViewRef.current?.injectJavaScript(script);
    } catch (apiError) {
      console.error('Routing failed', apiError);
      setRouteError(apiError instanceof Error ? apiError.message : 'Failed to fetch safe route');
    }
  };

  const handleCancelNavigation = () => {
    setIsNavigating(false);
    setSelectedDestName('');
    setEta('');
    setDistance('');
    setRouteError(null);
    webViewRef.current?.injectJavaScript('window.clearRoute(); true;');
  };

  const handleCenterUser = () => {
    webViewRef.current?.injectJavaScript('window.centerOnUser(); true;');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.floatingHeader}>
          {!isNavigating ? (
            <View>
              <GlassInput
                placeholder="Where do you want to go?"
                icon={<Search color={Colors.teal} size={20} />}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
              {suggestions.length > 0 && (
                <GlassCard style={styles.suggestionsContainer}>
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.lat + item.lon}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectPlace(item)}>
                        <MapPin color={Colors.teal} size={16} />
                        <View style={styles.suggestionContent}>
                          <Text style={styles.suggestionTitle} numberOfLines={1}>
                            {item.display_name.split(',')[0]}
                          </Text>
                          <Text style={styles.suggestionSubtitle} numberOfLines={1}>
                            {item.display_name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    scrollEnabled={false}
                  />
                </GlassCard>
              )}
            </View>
          ) : (
            <GlassCard style={styles.headerCard}>
              <TouchableOpacity onPress={handleCancelNavigation} style={styles.backButton}>
                <Text style={styles.backButtonText}>{'<'}</Text>
              </TouchableOpacity>
              <MapPin color={Colors.teal} size={20} style={styles.headerIcon} />
              <Text style={styles.headerText} numberOfLines={1}>
                {selectedDestName || 'Unknown Destination'}
              </Text>
            </GlassCard>
          )}
        </View>

        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            <iframe
              srcDoc={STATIC_MAP_HTML}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Safe Route Map"
              onLoad={() => setMapReady(true)}
            />
          ) : (
            <WebView
              ref={webViewRef}
              source={{ html: STATIC_MAP_HTML }}
              style={{ flex: 1 }}
              scrollEnabled={false}
              onLoadEnd={() => setMapReady(true)}
            />
          )}

          {loading && (
            <View style={styles.statusOverlay}>
              <ActivityIndicator size="large" color={Colors.teal} />
              <Text style={styles.statusText}>Fetching Location...</Text>
            </View>
          )}
          {error && !loading && (
            <View style={styles.statusOverlay}>
              <AlertCircle color={Colors.danger} size={32} />
              <Text style={[styles.statusText, { color: Colors.danger }]}>{error}</Text>
              <Text style={styles.fallbackText}>Please enable GPS to use map features.</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.myLocationBtn, { bottom: isNavigating ? 320 : Theme.spacing.xl }]}
            onPress={handleCenterUser}
          >
            <LocateFixed color={Colors.teal} size={24} />
          </TouchableOpacity>
        </View>

        {isNavigating && (
          <View style={styles.floatingBottom}>
            <GlassCard style={styles.infoCard}>
              <View style={styles.routeOption}>
                <View style={styles.routeHeader}>
                  <View style={[styles.routeColorDot, { backgroundColor: Colors.teal }]} />
                  <Text style={styles.routeTitle}>Safe Route (Recommended)</Text>
                  <Text style={styles.routeEta}>{eta || '-- min'}</Text>
                </View>
                <Text style={styles.routeDesc}>
                  {distance || '-- km'} • Prioritizes lower-risk segments and known incident avoidance
                </Text>
                {routeError ? <Text style={styles.routeError}>{routeError}</Text> : null}
              </View>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.startNavBtn}>
                <Navigation color={Colors.white} size={20} />
                <Text style={styles.startNavText}>START NAVIGATION</Text>
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
  suggestionsContainer: {
    marginTop: Theme.spacing.sm,
    maxHeight: 250,
    padding: Theme.spacing.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  suggestionContent: {
    marginLeft: 12,
    flex: 1,
  },
  suggestionTitle: {
    color: Colors.white,
    fontSize: Theme.typography.sizes.md,
    fontWeight: '600',
  },
  suggestionSubtitle: {
    color: Colors.white60,
    fontSize: 12,
    marginTop: 2,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: Colors.white60,
    fontSize: 18,
  },
  headerIcon: {
    marginLeft: Theme.spacing.md,
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
  statusOverlay: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: Colors.card,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 15,
  },
  statusText: {
    color: Colors.white,
    marginTop: Theme.spacing.md,
    fontSize: Theme.typography.sizes.md,
    fontWeight: '600',
  },
  fallbackText: {
    color: Colors.white60,
    marginTop: Theme.spacing.sm,
    fontSize: Theme.typography.sizes.sm,
    textAlign: 'center',
  },
  myLocationBtn: {
    position: 'absolute',
    right: Theme.spacing.lg,
    backgroundColor: Colors.card,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#2D1E17',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
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
  routeError: {
    color: Colors.danger,
    fontSize: 12,
    marginLeft: 20,
    marginTop: Theme.spacing.sm,
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
