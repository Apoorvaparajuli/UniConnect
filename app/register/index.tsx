// import { Text, View } from "react-native";

// export default function Screen() {
//   return (
//     <View>
//       <Text>Screen</Text>
//     </View>
//   );
// }

// register/index.tsx - Register Screen


import { useRouter } from 'expo-router'; // navigation
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity
} from 'react-native';
import { registerUser } from '../../services/authService'; // our register function

export default function RegisterScreen() {
  const router = useRouter(); // used to navigate between screens

  // Track what user types in each field
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false); // true = show spinner

  // Runs when user taps "Create Account"
  const handleRegister = async () => {
    // Stop if any field is empty
    if (!fullName || !email || !password || !confirmPassword || !grade) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Stop if passwords don't match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Stop if password is too short
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true); // show spinner
    try {
      await registerUser(email, password, fullName, grade); // create account in Firebase
      Alert.alert('Success', 'Account created successfully!');
      // router.replace('/home'); // go to home screen on success
      router.replace('/(tabs)/home')
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message); // show error if failed
    } finally {
      setLoading(false); // hide spinner
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Page title */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join STEMM Lab today!</Text>

      {/* Full name field */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName} // updates as user types
      />

      {/* Email field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Grade field */}
      <TextInput
        style={styles.input}
        placeholder="Grade / Year Level (e.g. Year 8)"
        value={grade}
        onChangeText={setGrade}
      />

      {/* Password field - characters hidden */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // hides password
      />

      {/* Confirm password field */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry // hides password
      />

      {/* Create Account button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" /> // spinner while loading
          : <Text style={styles.buttonText}>Create Account</Text>
        }
      </TouchableOpacity>

      {/* Link to Login screen */}
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C63FF', // purple
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#6C63FF', // purple button
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#6C63FF',
    fontSize: 14,
  },
});