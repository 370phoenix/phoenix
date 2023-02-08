import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAp0HRCSDXpcF-hrU39-5NrFusN6DWvUlY",
    authDomain: "phoenix-370.firebaseapp.com",
    projectId: "phoenix-370",
    storageBucket: "phoenix-370.appspot.com",
    messagingSenderId: "816203081042",
    appId: "1:816203081042:web:a12db79bba73ff204f468b"
};

const app = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase());
let response;

response = await get(child(dbRef, 'posts'));
  if (response.exists()) {
    console.log(JSON.parse(JSON.stringify(response)));
  } else {
    console.log("No data available");
  }


