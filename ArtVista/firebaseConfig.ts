import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzaRRDm9g8suRS3kk7MpXXwk5vCV_PGeQ",
  authDomain: "artvista-firebase.firebaseapp.com",
  projectId: "artvista-firebase",
  storageBucket: "artvista-firebase.firebasestorage.app",
  messagingSenderId: "829413563633",
  appId: "1:829413563633:web:f0dae925bcee5592731d50",
};

const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
