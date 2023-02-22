import { User } from "firebase/auth/react-native";
import { getDatabase, ref, set } from "firebase/database";

import { PostID, PostType } from "../constants/DataTypes";
import { fire } from "../firebaseConfig";
import { getUserOnce, MessageType, writeUser } from "./auth";

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

        const r1 = await getUserOnce(user);
        if (r1.type !== MessageType.success) throw Error(`Error fetching user data: ${r1.message}`);

        let userInfo = r1.data;
        const riders: Array<PostID> = userInfo["riders"];
        riders.push(post.postID);
        userInfo["riders"] = riders;
        const r2 = await writeUser({ userId: user.uid, userInfo });
        if (r2.type === MessageType.error) throw Error(`Error setting user data: ${r2.message}`);

        return true;
    } catch (e: any) {
        return "Error: " + e.message;
    }
}
