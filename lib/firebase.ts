import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBc5TPXY68Dp1e7W_k8wY16fm5uxbVxUFY",
  authDomain: "stemm-lab-d2bbd.firebaseapp.com",
  projectId: "stemm-lab-d2bbd",
  storageBucket: "stemm-lab-d2bbd.firebasestorage.app",
  messagingSenderId: "828669585393",
  appId: "1:828669585393:web:bbdce5fa4d1c54af928650",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
