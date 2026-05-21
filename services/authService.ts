// authService.ts - All login, register and logout functions

import {
    createUserWithEmailAndPassword, // logs out user
    onAuthStateChanged, // creates new account
    signInWithEmailAndPassword, // logs in user
    signOut, // watches login state
    User // TypeScript user type
} from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore'; // database functions
import { auth, db } from './firebase'; // our firebase setup

// Register new user - called when student clicks "Create Account"
export const registerUser = async (
  email: string,
  password: string,
  fullName: string,
  grade: string
) => {
  // Create account in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save student profile in Firestore database
  await setDoc(doc(db, 'users', user.uid), {
    fullName,     // student name
    email,        // student email
    grade,        // year level
    points: 0,    // starts at 0
    teamName: '', // set later
    createdAt: new Date().toISOString(), // join date
  });

  return user;
};

// Login existing user - called when student clicks "Login"
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Logout user - called when student clicks "Logout" in Settings
export const logoutUser = async () => {
  await signOut(auth);
};

// Watch auth state - detects if user is logged in or out
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};