import { getDatabase, ref, set } from "firebase/database";

import { PostType } from "../constants/DataTypes";

export default async function writeUserData(post: PostType) {
    const db = getDatabase();
    await set(ref(db, "posts/" + post.postID), {
        ...post,
    });
    return true;
}
