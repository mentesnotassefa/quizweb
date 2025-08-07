import { initializeApp } from "firebase/app";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail, // Make sure this is imported
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB7sdmxzW5PSxQnBC8JBxrsLypw4470fJo",
  authDomain: "chls-fa39c.firebaseapp.com",
  projectId: "chls-fa39c",
  storageBucket: "chls-fa39c.firebasestorage.app",
  messagingSenderId: "131215622700",
  appId: "1:131215622700:web:c1dc976240c1b81c00c789",
  measurementId: "G-REEW85EK2F",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Make sure all auth methods are exported
export { 
  auth,
  database,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail, // Must be exported here
  signOut,
  onAuthStateChanged
};