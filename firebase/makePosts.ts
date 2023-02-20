import { getDatabase, ref, set } from "firebase/database";

import { PostType } from "../constants/DataTypes";
import { fire } from "../firebaseConfig";

export default async function writeUserData(post: PostType): Promise<true | string> {
    try {
        const db = getDatabase(fire);
        await set(ref(db, "posts/" + post.postID), {
            ...post,
        });
        return true;
    } catch (e: any) {
        return "Error: " + e.message;
    }
}
