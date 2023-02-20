import {
    getAuth,
    initializeAuth,
    getReactNativePersistence,
    Auth,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";

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

let fire: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
    fire = initializeApp(firebaseConfig);
    auth = initializeAuth(fire, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} else {
    fire = getApp();
    auth = getAuth(fire);
}

export { fire, auth };
