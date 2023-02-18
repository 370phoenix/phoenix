import { initializeApp, getApp, getApps } from "firebase/app";
import { getReactNativePersistence, getAuth, initializeAuth } from "firebase/auth/react-native";
import { AsyncStorage } from "@react-native-async-storage/async-storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "phoenix-370.firebaseapp.com",
    projectId: "phoenix-370",
    storageBucket: "phoenix-370.appspot.com",
    databaseURL: "https://phoenix-370-default-rtdb.firebaseio.com",
    messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

const fire = initializeApp(firebaseConfig);
const auth = getAuth(fire);

export { fire, auth };
