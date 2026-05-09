import React from 'react';
import { Tabs } from 'expo-router';
import { Shield, Map, Bell, User, Flame } from 'lucide-react-native';
import { Colors, Theme } from '../../constants/theme';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';

// ── Custom SOS Tab Button ───────────────────────────
function SOSTabButton({ children, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.sosButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.sosGlow} />
      <View style={styles.sosButton}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Platform.OS === 'web'
            ? 'rgba(255, 253, 249, 0.85)'
            : Colors.ivory,
          borderTopColor: Colors.glassStroke,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 10,
          // Frosted glass elevation
          shadowColor: '#3E2723',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 16,
          elevation: 12,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarActiveTintColor: Colors.rose,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : undefined}>
              <Shield color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="map"
        options={{
          title: 'Navigate',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : undefined}>
              <Map color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="sos-trigger"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('sos/emergency');
          },
        })}
        options={{
          title: '',
          tabBarButton: (props) => <SOSTabButton {...props} />,
          tabBarIcon: () => <Flame color={Colors.textOnAccent} size={26} strokeWidth={2.5} />,
        }}
      />

      <Tabs.Screen
        name="heatmap"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : undefined}>
              <Bell color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : undefined}>
              <User color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />

      {/* Hidden tabs */}
      <Tabs.Screen name="insights" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: Colors.glowRose,
    borderRadius: 12,
    padding: 6,
  },
  sosButtonContainer: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.glowDanger,
  },
  sosButton: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.ivory,
    shadowColor: Colors.danger,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
