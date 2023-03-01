import { User } from "firebase/auth/react-native";
import { getDatabase, ref, set } from "firebase/database";

import {
    ErrorMessage,
    getUserOnce,
    MessageType,
    SuccessMessage,
    UserInfo,
    writeUser,
} from "./auth";
import { PostID, PostType, UserID } from "../constants/DataTypes";
import { fire } from "../firebaseConfig";
import { fetchPost } from "./fetchPosts";

export async function createPost(post: PostType, user: User | null): Promise<true | string> {
    try {
        if (!user) throw Error("No user signed in.");

        const res = await writePostData(post);
        if (res.type === MessageType.error) throw Error(res.message);

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

export async function writePostData(post: PostType): Promise<SuccessMessage | ErrorMessage> {
    try {
        const db = getDatabase(fire);

        await set(ref(db, "posts/" + post.postID), {
            ...post,
        });

        return { type: MessageType.success };
    } catch (e: any) {
        return { type: MessageType.error, message: `Error: ${e.message}` };
    }
}

type ARParams = {
    isAccept: boolean;
    userInfo: UserInfo | null;
    requesterID: UserID;
    posterID: UserID;
    postID: PostID;
};
export async function handleAcceptReject({
    isAccept,
    userInfo,
    requesterID,
    postID,
    posterID,
}: ARParams): Promise<SuccessMessage | ErrorMessage> {
    try {
        if (!userInfo) throw new Error("Missing User Info.");

        // update requesting user (userID). Delete from pending and (optionally) add to matches.
        const r1 = await getUserOnce(requesterID);
        if (r1.type !== MessageType.success) throw new Error(r1.message);
        if (!r1.data) throw new Error("Missing User Data.");
        let requesterInfo = r1.data;

        const i = requesterInfo.pending?.indexOf(postID);
        if (i && requesterInfo.pending) requesterInfo.pending.splice(i, 1);
        if (isAccept) {
            if (requesterInfo.matches) requesterInfo.matches.push(postID);
            else {
                const newMatches = [];
                newMatches.push(postID);
                requesterInfo.matches = newMatches;
            }
        }

        const r2 = await writeUser({ userId: requesterID, userInfo: requesterInfo });
        if (r2.type === MessageType.error) throw new Error(r2.message);

        // Update post in DB. Remove requester from pending and optionally add to riders
        const r3 = await fetchPost(postID);
        if (r3.type === MessageType.error) throw new Error(r3.message);
        if (!r3.data) throw new Error("Missing Post Data.");

        const post = r3.data;
        const j = post.pending?.indexOf(requesterID);
        if (j && post.pending) post.pending.splice(j, 1);
        if (isAccept) {
            if (post.riders) post.riders.push(requesterID);
            else {
                const newRiders = [];
                newRiders.push(requesterID);
                post.riders = newRiders;
            }
        }
        const r4 = await writePostData(post);
        if (r4.type === MessageType.error) throw new Error(r4.message);

        // update original user. Remove from user requests.
        const k = userInfo.requests.indexOf([requesterID, postID]);
        userInfo.requests.splice(k, 1);

        const r5 = await writeUser({ userId: posterID, userInfo });
        if (r5.type === MessageType.error) throw new Error(r5.message);

        return { type: MessageType.success };
    } catch (e: any) {
        return { type: MessageType.error, message: `Error: ${e.message}` };
    }
}
