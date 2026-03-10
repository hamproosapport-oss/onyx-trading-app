import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, disableNetwork } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGp13Lks3IqKr8qzAF1GbDamw2VqUWzfQ",
  authDomain: "onyxopthon.firebaseapp.com",
  projectId: "onyxopthon",
  storageBucket: "onyxopthon.firebasestorage.app",
  messagingSenderId: "465126244679",
  appId: "1:465126244679:web:45789af1cf92b2ddb88c62",
  measurementId: "G-JYFJPYBJXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
