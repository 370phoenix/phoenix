import { getDatabase, ref, set } from "firebase/database";

export default function writeUserData(post) {
  const db = getDatabase();
  set(ref(db, 'posts'), {
    post: post
  });
}