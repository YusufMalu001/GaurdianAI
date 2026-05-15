import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';

export default function PermissionsScreen() {
  const requestPermissions = async () => {
    // Request Location
    let { status: locStatus } = await Location.requestForegroundPermissionsAsync();
    
    // Request Contacts
    let { status: contactStatus } = await Contacts.requestPermissionsAsync();

    // Ideally request notifications here as well using expo-notifications

    if (locStatus === 'granted' && contactStatus === 'granted') {
      router.replace('/(tabs)/contacts');
    } else {
      alert('We need these permissions to keep you safe.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guardian Protection</Text>
      <Text style={styles.subtitle}>Add people you trust so Guardian can protect you during emergencies.</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Location Access</Text>
        <Text style={styles.cardDesc}>To share your live location during an SOS.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>👥 Contacts Access</Text>
        <Text style={styles.cardDesc}>To select your Trusted Contacts easily.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔔 Notifications</Text>
        <Text style={styles.cardDesc}>To receive critical emergency alerts.</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={requestPermissions}>
        <Text style={styles.buttonText}>Enable Protection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 14,
    color: '#aaa',
  },
  button: {
    backgroundColor: '#ff3b30',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
