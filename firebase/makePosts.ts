import { getDatabase, ref, set } from "firebase/database";

import { PostType } from "../constants/DataTypes";

export default async function writeUserData(post: PostType) : Promise<true | string> {
    const db = getDatabase();
    try {
        await set(ref(db, "posts/" + post.postID), {
            ...post,
        });
        return true;

    }
    catch(e: any) {
        return ("Error: " + e.message);
    }
}
