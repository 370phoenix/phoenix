import { initializeApp } from "firebase/app";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAp0HRCSDXpcF-hrU39-5NrFusN6DWvUlY",
    authDomain: "phoenix-370.firebaseapp.com",
    projectId: "phoenix-370",
    storageBucket: "phoenix-370.appspot.com",
    messagingSenderId: "816203081042",
    appId: "1:816203081042:web:a12db79bba73ff204f468b"
};

const fire = initializeApp(firebaseConfig);

export { fire };
