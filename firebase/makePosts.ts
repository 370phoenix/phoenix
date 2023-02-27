import { User } from "firebase/auth/react-native";
import { getDatabase, ref, set } from "firebase/database";

import { getUserOnce, MessageType, writeUser } from "./auth";
import { PostID, PostType } from "../constants/DataTypes";
import { fire } from "../firebaseConfig";

export default async function writeUserData(
    post: PostType,
    user: User | null
): Promise<true | string> {
    try {
        if (!user) throw Error("No user signed in.");
        const db = getDatabase(fire);

        await set(ref(db, "posts/" + post.postID), {
            ...post,
        });

        const r1 = await getUserOnce(user.uid);
        if (r1.type !== MessageType.success) throw Error(`Error fetching user data: ${r1.message}`);

        const userInfo = r1.data;
        if (!userInfo) throw new Error("Could not find user info.");

        const posts: PostID[] = userInfo.posts ? userInfo.posts : [];
        posts.push(post.postID);
        userInfo.posts = posts;
        const r2 = await writeUser({ userId: user.uid, userInfo });
        if (r2.type === MessageType.error) throw Error(`Error setting user data: ${r2.message}`);

        return true;
    } catch (e: any) {
        console.log(`Error in Write user Data: ${e.message}`);
        return "Error: " + e.message;
    }
}
