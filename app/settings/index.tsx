// import { Text, View } from "react-native";

// export default function Screen() {
//   return (
//     <View>
//       <Text>Screen</Text>
//     </View>
//   );
// }
// settings/index.tsx - Settings Screen
// Created by: Apoorva

import { useRouter } from 'expo-router'; // navigation
import { doc, updateDoc } from 'firebase/firestore'; // update database
import React, { useState } from 'react';
import {
  Alert, ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { logoutUser } from '../../services/authService'; // logout function
import { auth, db } from '../../services/firebase'; // firebase setup

export default function SettingsScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);          // dark mode toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // notifications toggle

  // Save dark mode preference to Firestore
  const handleDarkModeToggle = async (value: boolean) => {
    setIsDarkMode(value);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          darkMode: value, // save to database
        });
      }
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  };

  // Save notifications preference to Firestore
  const handleNotificationsToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          notifications: value, // save to database
        });
      }
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();            // logout from Firebase
              router.replace('/login');      // go to login screen
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              await user?.delete();          // delete from Firebase Auth
              router.replace('/login');      // go to login screen
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* App settings section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>

        {/* Dark mode toggle */}
        <View style={styles.row}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{ true: '#6C63FF' }} // purple when on
          />
        </View>

        {/* Notifications toggle */}
        <View style={styles.row}>
          <Text style={styles.label}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{ true: '#6C63FF' }}
          />
        </View>
      </View>

      {/* Account settings section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        {/* Edit profile link */}
        <TouchableOpacity style={styles.row} onPress={() => router.push('/settings/edit')}>
          <Text style={styles.label}>Edit Profile</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* About link */}
        <TouchableOpacity style={styles.row} onPress={() => router.push('/settings/stem-connect')}>
          <Text style={styles.label}>About STEMM Lab</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Delete account button */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 20,
    color: '#888',
  },
  logoutButton: {
    backgroundColor: '#FF4444', // red
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  deleteText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});