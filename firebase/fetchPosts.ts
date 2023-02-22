import { getDatabase, ref, get } from "firebase/database";
import { PostID, PostType } from "../constants/DataTypes";
import { fire } from "../firebaseConfig";
import { ErrorMessage, MessageType, SuccessMessage } from "./auth";

const db = getDatabase(fire);

export async function fetchPosts(): Promise<PostType[]> {
    try {
        const response = await get(ref(db, "posts"));
        const data = response.val();
        return data;
    } catch (e: any) {
        return e.message;
    }
}

export async function fetchPost(postId: PostID): Promise<SuccessMessage<PostType> | ErrorMessage> {
    try {
        const snapshot = await get(ref(db, "posts/" + postId));
        const val = snapshot.val();
        if (snapshot.exists())
            return {
                type: MessageType.success,
                data: {
                    ...val,
                    riders: val.riders ? val.riders : [],
                    pending: val.pending ? val.pending : [],
                },
            };
        else return { type: MessageType.error, message: "Error: post missing or not found." };
    } catch (e: any) {
        return { message: `Error: ${e.message}`, type: MessageType.error };
    }
}
