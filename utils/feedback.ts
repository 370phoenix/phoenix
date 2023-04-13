import { firebase } from "@react-native-firebase/database";
import { SuccessMessage, ErrorMessage, MessageType } from "./auth";
import { FeedbackEntryType } from "../constants/DataTypes";

const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

export async function pushFeecback(
    feedback: FeedbackEntryType
): Promise<SuccessMessage | ErrorMessage> {
    try {
        if (!userID) throw Error("No user signed in.");
        if (!userInfo) throw Error("No user info found.");

        const postRef = db.ref("posts/").push();
        if (!postRef.key) throw new Error("No key generated.");
        const postID = postRef.key;
        const newPost: PostType = {
            ...post,
            postID,
        };
        await postRef.set(newPost);

        const posts: PostID[] = userInfo.posts ? userInfo.posts : [];
        posts.push(postID);
        userInfo.posts = posts;
        const r2 = await writeUser(userID, userInfo);
        if (r2.type === MessageType.error) throw Error(`Error setting user data: ${r2.message}`);

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        console.log(`Error in Write user Data: ${e.message}`);
        return { message: "Error: " + e.message, type: MessageType.error };
    }
}
