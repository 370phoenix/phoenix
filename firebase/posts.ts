import { child, get, getDatabase, ref, remove } from "firebase/database";
import { PostID, PostType, UserID } from "../constants/DataTypes";
import { ErrorMessage, MessageType, SuccessMessage, UserInfo, writeUser } from "./auth";

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

export async function deletePost(
    id: PostID,
    userId: UserID,
    userInfo: UserInfo
): Promise<SuccessMessage | ErrorMessage> {
    try {
        const db = getDatabase();
        await remove(ref(db, "posts/" + id));

        let newPosts = userInfo.posts ? userInfo.posts : [];
        if (newPosts.length == 1) newPosts = [];
        else {
            const i = newPosts.indexOf(id);
            if (i !== -1) newPosts.splice(i, 1);
        }
        userInfo.posts = newPosts;

        const res = await writeUser({
            userId,
            userInfo,
        });
        if (res.type === MessageType.error) throw Error(res.message);

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        console.log(`Error in delete post: ${e.message}`);
        return { type: MessageType.error, message: e.message };
    }
}
