import { fire } from "./firebaseConfig.js";
import { getDatabase, ref, child, get } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAp0HRCSDXpcF-hrU39-5NrFusN6DWvUlY",
    authDomain: "phoenix-370.firebaseapp.com",
    projectId: "phoenix-370",
    storageBucket: "phoenix-370.appspot.com",
    messagingSenderId: "816203081042",
    appId: "1:816203081042:web:a12db79bba73ff204f468b"
};

const app = fire;

const dbRef = ref(getDatabase());
let json;

json = await get(child(dbRef, `posts/posts`));
  if (json.exists()) {
    let str = JSON.stringify(json);
    let parsed = JSON.parse(str);
    console.log(parsed);
  } else {
    console.log("No data available");
  }


