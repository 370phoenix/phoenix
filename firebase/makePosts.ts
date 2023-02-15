import { getDatabase, ref, set } from "firebase/database";

import { PostType } from "../constants/DataTypes";

export default function writeUserData(post: PostType) {
    const db = getDatabase();
    set(ref(db, "posts/" + post.postID), {
        ...post,
    })
    // TODO: add confirmation of created post
}

