import React from 'react';
import { Tabs } from 'expo-router';
import { Shield, Map, Activity, User, Flame } from 'lucide-react-native';
import { Colors, Theme } from '../../constants/theme';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

// Custom SOS Tab Button
function SOSTabButton({ children, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.sosButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
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
          backgroundColor: Colors.secondary,
          borderTopColor: 'rgba(255,255,255,0.05)',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.cyan,
        tabBarInactiveTintColor: Colors.white60,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Shield color={color} size={24} />,
        }}
      />
      
      <Tabs.Screen
        name="map"
        options={{
          title: 'Navigate',
          tabBarIcon: ({ color }) => <Map color={color} size={24} />,
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
          title: 'SOS',
          tabBarButton: (props) => <SOSTabButton {...props} />,
          tabBarIcon: () => <Flame color={Colors.white} size={28} />,
        }}
      />

      <Tabs.Screen
        name="heatmap"
        options={{
          title: 'Heatmap',
          tabBarIcon: ({ color }) => <Activity color={color} size={24} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />

      {/* Hidden tabs that we don't want in the bottom bar */}
      <Tabs.Screen name="insights" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  sosButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.primary,
    shadowColor: Colors.danger,
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  }
});
