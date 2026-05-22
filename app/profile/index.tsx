// profile/index.tsx - Team Profile Screen


import { useRouter } from 'expo-router'; // navigation
import { doc, getDoc } from 'firebase/firestore'; // read from database
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { logoutUser } from '../../services/authService'; // logout function
import { auth, db } from '../../services/firebase'; // firebase setup

// TypeScript type for user profile data
interface UserProfile {
  fullName: string;
  email: string;
  grade: string;
  points: number;
  teamName: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null); // stores user data
  const [loading, setLoading] = useState(true); // true = show spinner

  // Runs when screen loads - fetches user profile from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser; // get logged in user
        if (!user) {
          router.replace('/login'); // not logged in - go to login
          return;
        }

        // Get user document from Firestore database
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile); // save profile data
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false); // hide spinner
      }
    };

    fetchProfile();
  }, []);

  // Runs when user taps Logout
  const handleLogout = async () => {
    try {
      await logoutUser(); // call logout function
      router.replace('/login'); // go back to login screen
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Show spinner while loading
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Profile avatar circle with initials */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {profile?.fullName?.charAt(0).toUpperCase() || 'U'}
        </Text>
      </View>

      {/* User's full name */}
      <Text style={styles.name}>{profile?.fullName || 'Student'}</Text>

      {/* User's grade */}
      <Text style={styles.grade}>{profile?.grade || 'Grade not set'}</Text>

      {/* Points badge */}
      <View style={styles.pointsBadge}>
        <Text style={styles.pointsText}>⭐ {profile?.points || 0} Points</Text>
      </View>

      {/* Profile details card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile Details</Text>

        {/* Email row */}
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile?.email || 'N/A'}</Text>
        </View>

        {/* Team name row */}
        <View style={styles.row}>
          <Text style={styles.label}>Team</Text>
          <Text style={styles.value}>{profile?.teamName || 'No team yet'}</Text>
        </View>

        {/* Grade row */}
        <View style={styles.row}>
          <Text style={styles.label}>Grade</Text>
          <Text style={styles.value}>{profile?.grade || 'N/A'}</Text>
        </View>
      </View>

      {/* Logout button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,           // makes it circular
    backgroundColor: '#6C63FF', // purple
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  grade: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  pointsBadge: {
    backgroundColor: '#EEEDFE', // light purple
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  pointsText: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#FF4444', // red logout button
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});