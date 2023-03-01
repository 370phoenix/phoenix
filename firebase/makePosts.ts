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

        return { type: MessageType.success, data: undefined };
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

        // Get Requester Info
        const r1 = await getUserOnce(requesterID);
        if (r1.type !== MessageType.success) throw new Error(r1.message);
        const requesterInfo = r1.data;

        // Get post from DB
        const r3 = await fetchPost(postID);
        if (r3.type === MessageType.error) throw new Error(r3.message);
        const post = r3.data;

        // Update Requester Info
        // Remove from requester pending for accept or deny
        if (requesterInfo.pending) {
            const i = requesterInfo.pending.indexOf(postID);
            if (i != -1 && requesterInfo.pending) requesterInfo.pending.splice(i, 1);
        }
        // Add to matches for accept
        if (isAccept)
            requesterInfo.matches = requesterInfo.matches
                ? [...requesterInfo.matches, postID]
                : [postID];
        const r2 = await writeUser({ userId: requesterID, userInfo: requesterInfo });
        if (r2.type === MessageType.error) throw new Error(r2.message);

        // Update Post Info
        // Remove from post pending for accept or deny
        if (post.pending) {
            const j = post.pending.indexOf(requesterID);
            if (j != -1 && post.pending) post.pending.splice(j, 1);
        }
        // Add to post riders if accept
        if (isAccept) post.riders = post.riders ? [...post.riders, requesterID] : [requesterID];
        const r4 = await writePostData(post);
        if (r4.type === MessageType.error) throw new Error(r4.message);

        // Update Poster Info
        // Remove from requests for accept or deny
        const k = findIndex(userInfo.requests, [requesterID, postID]);
        if (k !== -1) userInfo.requests.splice(k, 1);
        const r5 = await writeUser({ userId: posterID, userInfo });
        if (r5.type === MessageType.error) throw new Error(r5.message);

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { type: MessageType.error, message: `Error: ${e.message}` };
    }
}

const findIndex = (requests: [UserID, PostID][], request: [UserID, PostID]) => {
    for (let i = 0; i < requests.length; i++) {
        const req = requests[i];
        if (req[0] == request[0] && req[1] == request[1]) return i;
    }
    return -1;
};

export async function matchPost(
    userID: UserID,
    post: PostType
): Promise<SuccessMessage | ErrorMessage> {
    try {
        // Get Poster Info
        const posterID = post.user;
        const r1 = await getUserOnce(posterID);
        if (r1.type !== MessageType.success) throw new Error(r1.message);
        const posterInfo = r1.data;

        // Get Requester Info
        const r2 = await getUserOnce(userID);
        if (r2.type !== MessageType.success) throw new Error(r2.message);
        const requesterInfo = r2.data;

        // Update requester to have pending
        requesterInfo.pending = requesterInfo.pending
            ? [...requesterInfo.pending, post.postID]
            : [post.postID];
        const r3 = await writeUser({ userId: userID, userInfo: requesterInfo });
        if (r3.type !== MessageType.success) throw new Error(r3.message);

        // Update Poster to have request
        posterInfo.requests = posterInfo.requests
            ? [...posterInfo.requests, [userID, post.postID]]
            : [[userID, post.postID]];
        const r4 = await writeUser({ userId: posterID, userInfo: posterInfo });
        if (r4.type !== MessageType.success) throw new Error(r4.message);

        // Update Post Info to have pending
        post.pending = post.pending ? [...post.pending, userID] : [userID];
        const r5 = await writePostData(post);
        if (r5.type !== MessageType.success) throw new Error(r5.message);

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { type: MessageType.error, message: `Error: ${e.message}` };
    }
}
