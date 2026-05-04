import React from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import ActionButton from '../../components/ui/ActionButton';
import { router } from 'expo-router';
import { Colors, Theme } from '../../constants/theme';
import SafetyScore from '../../components/ui/SafetyScore';
import GlassCard from '../../components/ui/GlassCard';
import { Bell, MapPin, Navigation, Flame, Share2 } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useLocation } from '../../hooks/useLocation';
import { useSafetyScore } from '../../hooks/useSafetyScore';
import NearbyAlerts from '../../components/dashboard/NearbyAlerts';
import AIInsightsCard from '../../components/dashboard/AIInsightsCard';
import GreetingCard from '../../components/dashboard/GreetingCard';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { location } = useLocation();
  const { score, riskLevel, riskColor } = useSafetyScore();
  const name = user?.name ?? 'Guest';
  
  const mapPreviewHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; background-color: #0F172A; }
        #map { width: 100vw; height: 100vh; }
        .leaflet-container { background: #0F172A; }
        .leaflet-control-container { display: none; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        var lat = ${location?.lat ?? 28.6139};
        var lng = ${location?.lng ?? 77.209};
        var map = L.map('map', { 
          zoomControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          touchZoom: false
        }).setView([lat, lng], 15);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        var markerHtml = '<div style="background-color: #10B981; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); border: 2px solid white;"></div>';
        var customIcon = L.divIcon({ html: markerHtml, className: 'custom-soft-marker', iconSize: [16, 16] });
        L.marker([lat, lng], { icon: customIcon }).addTo(map);
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <GreetingCard name={name} />
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.bellWrapper}>
            <View style={styles.bellContainer}>
              <Bell color={Colors.white} size={24} />
              <View style={styles.notificationDot} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <GlassCard style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MapPin color={Colors.teal} size={16} />
            <Text style={styles.locationText}>
              {location ? `Current: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Detecting location...'}
            </Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <SafetyScore score={score} size={140} />
            
            <View style={styles.scoreDetails}>
              <Text style={[styles.riskLevel, { color: riskColor }]}>{riskLevel} RISK</Text>
              <Text style={styles.riskDesc}>
                {riskLevel === 'LOW' ? 'Area is well-lit and populated.' : 'Caution: Incident frequency higher in this area.'}
              </Text>
            </View>
          </View>

          {/* Map Preview Snippet */}
          <View style={styles.mapPreviewContainer}>
            {Platform.OS === 'web' ? (
              <iframe 
                srcDoc={mapPreviewHtml} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                title="Map Preview"
              />
            ) : (
              <WebView source={{ html: mapPreviewHtml }} style={{ flex: 1 }} scrollEnabled={false} />
            )}
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.actionsGrid}>
          <ActionButton 
            title="Safe Route"
            variant="secondary"
            layout="vertical"
            icon={<Navigation color={Colors.teal} size={28} />}
            onPress={() => router.push('/(tabs)/map')}
            style={styles.actionBtnWrapper}
            buttonStyle={[styles.actionBtnInner, { borderColor: Colors.teal }]}
            textStyle={styles.actionText}
          />
          
          <ActionButton 
            title="SOS"
            variant="secondary"
            layout="vertical"
            icon={<Flame color={Colors.danger} size={28} />}
            onPress={() => router.push('/sos/emergency')}
            style={styles.actionBtnWrapper}
            buttonStyle={[styles.actionBtnInner, { borderColor: Colors.danger }]}
            textStyle={styles.actionText}
          />
          
          <ActionButton 
            title="Share"
            variant="secondary"
            layout="vertical"
            icon={<Share2 color={Colors.purple} size={28} />}
            onPress={() => {}}
            style={styles.actionBtnWrapper}
            buttonStyle={[styles.actionBtnInner, { borderColor: Colors.purple }]}
            textStyle={styles.actionText}
          />
        </View>

        {/* Nearby Alerts */}
        <Text style={styles.sectionTitle}>NEARBY ALERTS</Text>
        <NearbyAlerts />

        {/* AI Insights */}
        <View style={{ marginTop: Theme.spacing.lg }}>
          <AIInsightsCard />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    padding: Theme.spacing.lg,
    paddingBottom: 100, // padding for bottom tabs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    marginTop: Theme.spacing.md,
  },
  bellWrapper: {
    marginLeft: Theme.spacing.md,
  },
  bellContainer: {
    padding: Theme.spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
    shadowColor: Colors.danger,
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  statusCard: {
    marginBottom: Theme.spacing.xxl,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  locationText: {
    color: Colors.white80,
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: '500',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreDetails: {
    flex: 1,
    marginLeft: Theme.spacing.lg,
  },
  riskLevel: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: Theme.spacing.xs,
  },
  riskDesc: {
    color: Colors.white60,
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: {
    color: Colors.white60,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: Theme.spacing.md,
  },
  mapPreviewContainer: {
    height: 120,
    marginTop: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.secondary,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xxl,
  },
  actionBtnWrapper: {
    width: '30%',
    aspectRatio: 1,
  },
  actionBtnInner: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 0,
  },
  actionText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
});
