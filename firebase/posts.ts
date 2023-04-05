import { User } from "firebase/auth/react-native";
import { child, get, getDatabase, ref, set } from "firebase/database";

import { PostID, PostType, UserID } from "../constants/DataTypes";
import { fire } from "../firebaseConfig";
import {
    ErrorMessage,
    getUserOnce,
    MessageType,
    SuccessMessage,
    UserInfo,
    writeUser,
} from "./auth";
import { fetchPost } from "./fetchPosts";


export async function fetchSomePosts(
    ids: PostID[]
): Promise<SuccessMessage<PostType[]> | ErrorMessage> {
    try {
        const db = getDatabase();
        const postsRef = ref(db, "posts");
        const posts: PostType[] = [];

        for (const id of ids) {
            const postRef = child(postsRef, id);
            const res = await get(postRef);
            if (res.exists()) posts.push(res.val());
        }

        return { type: MessageType.success, data: posts };
    } catch (e: any) {
        return { type: MessageType.error, message: e.message };
    }
}