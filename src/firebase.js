// ─────────────────────────────────────────────────────────────────────────────
// Firebase Configuration
// Replace with your own Firebase project credentials from:
// https://console.firebase.google.com → Project Settings → Your Apps → Web
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyBCpw83tcyGHNXJmiDKiaYQkKXKoUsL-H4",
  authDomain:        "label-sanj.firebaseapp.com",
  databaseURL:       "https://label-sanj-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "label-sanj",
  storageBucket:     "label-sanj.firebasestorage.app",
  messagingSenderId: "82906631288",
  appId:             "1:82906631288:web:cb96efb7e65b492f65318d",
 measurementId:      "G-HVZ7H6RH6K"
};

const app     = initializeApp(firebaseConfig);
export const storage  = getStorage(app);
export const db       = getFirestore(app);
export default app;
