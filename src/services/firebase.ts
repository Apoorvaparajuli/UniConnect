// getApps - checks if Firebase is already running
import { getApps, initializeApp } from 'firebase/app';

// getAuth - gives us the authentication tool (login/register/logout
import { getAuth } from 'firebase/auth';

// getFirestore - gives us the database tool (store/read user data)
import { getFirestore } from 'firebase/firestore';

//firebase configuration 
// These values come from our .env file (keeps our keys secret)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Start Firebase only once - prevents duplicate instances
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Authentication instance - used in login/register/logout screens
export const auth = getAuth(app);

// Firestore instance - used to save and read user data
export const db = getFirestore(app);

export default app;