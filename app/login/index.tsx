// import { Text, View } from "react-native";

// export default function Screen() {
//   return (
//     <View>
//       <Text>Screen</Text>
//     </View>
//   );
// }

// login/index.tsx - Login Screen

import { useRouter } from 'expo-router'; // handles screen navigation
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { loginUser } from '../../services/authService'; // our login function

export default function LoginScreen() {
  const router = useRouter(); // used to move between screens

  // Store what user types in the form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // true = show spinner

  // Runs when user presses the Login button
  const handleLogin = async () => {
    // Stop if fields are empty
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true); // show loading spinner
    try {
      await loginUser(email, password); // try to login
      router.replace('/home');          // success - go to home
    } catch (error: any) {
      Alert.alert('Login Failed', error.message); // show error message
    } finally {
      setLoading(false); // hide spinner
    }
  };

  return (
    <View style={styles.container}>
      {/* App title */}
      <Text style={styles.title}>STEMM Lab</Text>
      <Text style={styles.subtitle}>Learn. Explore. Solve. Together.</Text>

      {/* Email input field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}         // updates email as user types
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password input field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}      // updates password as user types
        secureTextEntry                 // hides password characters
      />

      {/* Login button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" /> // show spinner while loading
          : <Text style={styles.buttonText}>Login</Text>
        }
      </TouchableOpacity>

      {/* Link to Register screen */}
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles - controls how everything looks
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6C63FF',    // STEMM Lab purple
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