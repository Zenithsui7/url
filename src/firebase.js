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
  projectId:         "label-sanj",
  storageBucket:     "label-sanj.firebasestorage.app",
  messagingSenderId: "82906631288",
  appId:             "1:82906631288:web:cb96efb7e65b492f65318d",
};

// Detect placeholder / unconfigured values
const PLACEHOLDER_KEYS = ['YOUR_API_KEY', 'YOUR_PROJECT_ID', 'YOUR_MESSAGING_SENDER_ID', 'YOUR_APP_ID'];
export const isFirebaseConfigured = !Object.values(firebaseConfig).some(v =>
  PLACEHOLDER_KEYS.some(p => v.includes(p))
);

const app     = initializeApp(firebaseConfig);
export const storage  = getStorage(app);
export const db       = getFirestore(app);
export default app;
