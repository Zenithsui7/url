// ─────────────────────────────────────────────────────────────────────────────
// Firebase Configuration
// Replace with your own Firebase project credentials from:
// https://console.firebase.google.com → Project Settings → Your Apps → Web
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

const app     = initializeApp(firebaseConfig);
export const storage  = getStorage(app);
export const db       = getFirestore(app);
export default app;
