import { getDatabase, ref, child, get, DataSnapshot } from "firebase/database";
import { initializeApp } from "firebase/app";
import { postObject } from "../constants/Types";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "phoenix-370.firebaseapp.com",
    projectId: "phoenix-370",
    storageBucket: "phoenix-370.appspot.com",
    messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase());

const fetchPosts = async () => {
    let response = await get(child(dbRef, "posts"));
    let data = response.val();
    return data;
};

export { fetchPosts };
