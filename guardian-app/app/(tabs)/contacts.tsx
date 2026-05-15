import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Phone, Star, ShieldAlert, Trash2 } from 'lucide-react-native';
import * as Contacts from 'expo-contacts';

export default function TrustedContactsScreen() {
  const [trustedContacts, setTrustedContacts] = useState([]);

  useEffect(() => {
    // In a real app, fetch from backend here.
  }, []);

  const handleAddContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      try {
        const contact = await Contacts.presentContactPickerAsync();

        if (contact) {
          if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) {
            Alert.alert('Invalid Contact', 'The selected contact does not have a phone number.');
            return;
          }

          const newContact = {
            id: contact.id,
            name: contact.name || 'Unknown',
            phone: contact.phoneNumbers[0].number || 'No number',
            relation: 'Trusted',
            isPriority: true,
          };

          if (trustedContacts.length >= 5) {
            Alert.alert('Limit Reached', 'You can only have up to 5 trusted contacts.');
            return;
          }

          if (trustedContacts.find((c: any) => c.id === contact.id || c.phone === newContact.phone)) {
            Alert.alert('Duplicate', 'This contact is already in your trusted list.');
            return;
          }

          setTrustedContacts([...trustedContacts, newContact]);
        }
      } catch (err) {
        console.error('Failed to pick contact:', err);
      }
    } else {
      Alert.alert('Permission Denied', 'Please grant contacts permission to add trusted contacts.');
    }
  };

  const removeContact = (id) => {
    setTrustedContacts(trustedContacts.filter((c) => c.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.contactCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactDetails}>{item.relation} • {item.phone}</Text>
      </View>
      {item.isPriority && <ShieldAlert size={20} color="#ff3b30" style={{ marginRight: 10 }} />}
      <TouchableOpacity onPress={() => removeContact(item.id)}>
        <Trash2 size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trusted Contacts</Text>
      <Text style={styles.subtitle}>These people will be instantly notified during an emergency.</Text>

      <FlatList
        data={trustedContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No trusted contacts added.</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
        <Text style={styles.addButtonText}>+ Add from Phone</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 40 },
  subtitle: { fontSize: 14, color: '#aaa', marginBottom: 20 },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  contactInfo: { flex: 1 },
  contactName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  contactDetails: { color: '#aaa', fontSize: 12 },
  addButton: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#666', fontSize: 16 },
});
