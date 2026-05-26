import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase Configuration
 * 
 * IMPORTANT: Replace these values with your actual Firebase project credentials
 * Get these from: Firebase Console → Project Settings → Your apps
 * 
 * Environment variables (Recommended for security):
 * Use .env.local file with EXPO_PUBLIC_ prefix for Expo to read them
 */

const firebaseConfig = {
  // Replace with your Firebase credentials
  // apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBzhmtjbHuWTpLd78DUZDeX0eFRSZtjSlE",
  // authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project-id.firebaseapp.com",
  // projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  // storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project-id.appspot.com",
  // messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  // appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef1234567890",
  // // Optional: If using database
  // databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  {
  "project_info": {
    "project_number": "680348817485",
    "project_id": "stemm-lab-320ec",
    "storage_bucket": "stemm-lab-320ec.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:680348817485:android:a2f0b1088611e80d4d2404",
        "android_client_info": {
          "package_name": "com.apoorva.campusmate"
        }
      },
      "oauth_client": [],
      "api_key": [
        {
          "current_key": "AIzaSyBzhmtjbHuWTpLd78DUZDeX0eFRSZtjSlE"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
],
  "configuration_version": "1"
}
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

