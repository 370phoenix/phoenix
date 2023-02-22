import { getDatabase, ref, get } from "firebase/database";
import { PostID, UserID } from "../constants/DataTypes";
import { fire } from "../firebaseConfig";
import { ErrorMessage, MessageType, SuccessMessage } from "./auth";

const db = getDatabase(fire);

export async function fetchPosts(): Promise<any> {
    try {
        const response = await get(ref(db, "posts"));
        const data = response.val();
        return data;
    } catch (e: any) {
        return e.message;
    }
}

export async function fetchPost(postId: PostID): Promise<SuccessMessage<any> | ErrorMessage> {
    try {
        const snapshot = await get(ref(db, "posts/" + String(postId)));
        if (snapshot.exists()) return { type: MessageType.success, data: snapshot.val() };
        else return { type: MessageType.error, message: "Error: post missing or not found." };
    } catch (e: any) {
        return { message: `Error: ${e.message}`, type: MessageType.error };
    }
}
