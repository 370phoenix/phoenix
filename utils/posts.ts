import { firebase } from "@react-native-firebase/database";

import {
    ErrorMessage,
    getUserOnce,
    MessageType,
    SuccessMessage,
    UserInfo,
    writeUser,
} from "./auth";
import { NewPostType, PostID, PostType, UserID } from "../constants/DataTypes";
import { FBPostType, FirebasePostSchema, FreshPostType, PostSchema } from "./postValidation";

const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

///////////////////////////////////////////
///////////////////////////////////////////
//////////////// TYPES ////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

export type Unsubscribe = () => void;

///////////////////////////////////////////
///////////////////////////////////////////
///////////// FETCH POSTS /////////////////
///////////////////////////////////////////
///////////////////////////////////////////

/**
 * Fetch a single post.
 *
 * @param postID (PostID): ID to fetch
 * @returns Success with Post Data | Error
 * @throws ZodError when validation fails
 */
export async function fetchPost(postID: PostID): Promise<PostType> {
    const snapshot = await db.ref("posts/" + postID).once("value");
    const val = snapshot.val();
    if (snapshot.exists())
        return PostSchema.parse({
            user: val.user,
            postID: val.postID,
            dropoff: val.dropoff,
            pickup: val.pickup,
            pickupCoords: val.pickupCoords,
            dropoffCoords: val.dropoffCoords,
            startTime: new Date(val.startTime),
            endTime: new Date(val.endTime),
            totalSpots: val.totalSpots,
            notes: val.notes,
            roundTrip: val.roundTrip,
        });
    else throw Error("Post does not exist.");
}

/**
 * Fetch all posts once.
 *
 * @returns (PostType[] | string): Post Data array or error messgae
 */
export async function fetchAllPosts(): Promise<SuccessMessage<PostType[]> | ErrorMessage> {
    try {
        const snapshot = await db.ref("posts").once("value");
        const data: PostType[] = Object.values(snapshot.val());
        data.sort((a, b) => a.startTime - b.startTime);
        return { type: MessageType.success, data: data };
    } catch (e: any) {
        return { type: MessageType.error, message: e.message };
    }
}

/**
 * Fetch some number of posts.
 *
 * @param ids (PostID[]): Array of ids to fetch
 * @returns (Success<PostType[] | ErrorMessage) Posts or an Error Message.
 */
export async function fetchSomePosts(
    ids: PostID[]
): Promise<SuccessMessage<PostType[]> | ErrorMessage> {
    try {
        const postsRef = db.ref("posts");
        const posts: PostType[] = [];

        for (const id of ids) {
            if (!id) continue;
            const postRef = postsRef.child(id);
            const snapshot = await postRef.once("value");
            if (snapshot.exists()) posts.push(snapshot.val());
        }

        return { type: MessageType.success, data: posts };
    } catch (e: any) {
        return { type: MessageType.error, message: e.message };
    }
}

type PostUpdateParams = {
    onChildChanged: (data: PostType) => void;
    onChildAdded: (data: PostType) => void;
    onChildRemoved: (data: PostType) => void;
};

export function getAllPostUpdates({
    onChildAdded,
    onChildChanged,
    onChildRemoved,
}: PostUpdateParams): SuccessMessage<Unsubscribe> | ErrorMessage {
    const postsRef = db.ref("posts");
    const onAdd = postsRef.on(
        "child_added",
        (snapshot) => {
            if (snapshot.exists()) {
                const data: PostType = snapshot.val();
                onChildAdded(data);
            }
        },
        (_) => {} // TODO: HANDLE (ERROR) => {}
    );
    const onChange = postsRef.on(
        "child_changed",
        (snapshot) => {
            if (snapshot.exists()) {
                const data: PostType = snapshot.val();
                onChildChanged(data);
            }
        },
        (_) => {} // TODO: HANDLE (ERROR) => {}
    );
    const onRemove = postsRef.on("child_removed", (snapshot) => {
        if (snapshot.exists()) {
            const data: PostType = snapshot.val();
            onChildRemoved(data);
        }
    });
    const unsub = () => {
        postsRef.off("child_added", onAdd);
        postsRef.off("child_changed", onChange);
        postsRef.off("child_removed", onRemove);
    };
    return { type: MessageType.success, data: unsub };
}

///////////////////////////////////////////
///////////////////////////////////////////
///////////// CREATE POSTS ////////////////
///////////////////////////////////////////
///////////////////////////////////////////

/**
 * Create a post in the db and user post array.
 *
 * @param post (PostType): The post data to create in the DB.
 * @param user (User): The user who is making the post.
 * @returns (SuccessMessage | ErrorMessage)
 */
export async function createPost(
    post: FreshPostType,
    userInfo: UserInfo | null
): Promise<SuccessMessage | ErrorMessage> {
    try {
        if (!userInfo) throw Error("No user info found.");
        const { user: userID } = post;

        // Add post to DB
        const postRef = db.ref("posts/").push();
        if (!postRef.key) throw new Error("No key generated.");
        const postID = postRef.key;
        const newPost: FBPostType = FirebasePostSchema.parse({ postID, ...post });
        await postRef.set(newPost);

        // Add post to user info
        const posts: PostID[] = userInfo.posts ? userInfo.posts : [];
        posts.push(postID);
        userInfo.posts = posts;
        const r2 = await writeUser(userID, userInfo);
        if (r2.type === MessageType.error) throw Error(`Error setting user data: ${r2.message}`);

        // Add a chat header
        await db.ref(`chats/${postID}`).set({
            postID,
            title: post.dropoff,
            displayNames: { [userID]: userInfo.username },
            lastMessage: undefined,
        });

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        console.error("Error in create post: " + e.message);
        return { message: "Error: " + e.message, type: MessageType.error };
    }
}

///////////////////////////////////////////
///////////////////////////////////////////
///////////// MODIFY POSTS ////////////////
///////////////////////////////////////////
///////////////////////////////////////////

/**
 * Overwrites existing data for a post object.
 *
 * @param post (PostType): The post data to overwrite.
 * @returns (SuccesMessage | ErrorMessage)
 */
export async function writePostData(post: PostType): Promise<SuccessMessage | ErrorMessage> {
    try {
        const postRef = db.ref("posts/" + post.postID);
        await postRef.set(post);

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { type: MessageType.error, message: `Error: ${e.message}` };
    }
}

type ARParams = {
    isAccept: boolean;
    userInfo: UserInfo | null;
    requesterID: UserID;
    requesterInfo: UserInfo | null;
    posterID: UserID;
    post: PostType;
};
/**
 * Handle a user accepting or denying a match request.
 *
 * @param ARParams: {
 *      isAccept (boolean): Is this an accept or reject request?
 *      userInfo (UserInfo): The info of the user who made the post.
 *      requesterID (UserID): The ID of the user who is requesting to join the post.
 *      posterID (UserID): The ID of the user who made the post.
 *      postID (PostID): The ID of the post the requester is trying to join.
 * }
 * @returns (SuccessMessage | ErrorMessage)
 */
export async function handleAcceptReject({
    isAccept,
    userInfo,
    requesterID,
    requesterInfo,
    post,
}: ARParams): Promise<SuccessMessage | ErrorMessage> {
    try {
        if (!userInfo || !requesterInfo) throw new Error("Missing User Info.");

        const { postID } = post;

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
        const r2 = await writeUser(requesterID, requesterInfo);
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

        if (isAccept) {
            console.log(`Adding ${requesterInfo.username} to chat ${postID}`);
            await db.ref(`chats/${postID}/displayNames/${requesterID}`).set(requesterInfo.username);
        }

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        console.error(e.message);
        return { type: MessageType.error, message: `Error: ${e.message}` };
    }
}

/**
 * Initiates a request for a user to match on a post after pressing the match button.
 *
 * @param userID (UserID): The ID of the user requesting to match on the ride.
 * @param post (PostType): The post the user is trying to match on.
 * @returns (SuccessMessage | ErrorMessage)
 */
export async function matchPost(
    userID: UserID,
    post: PostType
): Promise<SuccessMessage | ErrorMessage> {
    try {
        // Get Requester Info
        const r2 = await getUserOnce(userID);
        if (r2.type !== MessageType.success) throw new Error(r2.message);
        const requesterInfo = r2.data;

        // Update requester to have pending
        requesterInfo.pending = requesterInfo.pending
            ? [...requesterInfo.pending, post.postID]
            : [post.postID];
        const r3 = await writeUser(userID, requesterInfo);
        if (r3.type !== MessageType.success) throw new Error(r3.message);

        // Update Post Info to have pending
        post.pending = post.pending ? [...post.pending, userID] : [userID];
        const r5 = await writePostData(post);
        if (r5.type !== MessageType.success) throw new Error(r5.message);

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { type: MessageType.error, message: `Error: ${e.message}` };
    }
}

///////////////////////////////////////////
///////////////////////////////////////////
///////////// HELPERS /////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

/**
 * Initiates a request for a user to unmatch from a post after pressing the unmatch button.
 *
 * @param userID (UserID): The ID of the user requesting to unmatch from the ride.
 * @param post (PostType): The post the user is trying to unmatch from.
 * @returns (SuccessMessage | ErrorMessage)
 */
export async function unmatchPost(
    userID: UserID,
    post: PostType
): Promise<SuccessMessage | ErrorMessage> {
    try {
        // remove postID from user.matches
        const r1 = await getUserOnce(userID);
        if (r1.type !== MessageType.success) throw new Error(r1.message);
        const userInfo = r1.data;
        const newMatches = userInfo.matches;
        if (!userInfo || !newMatches) throw Error("Error fetching user info");
        const postIndex = newMatches.indexOf(post.postID);
        if (postIndex === -1) throw Error("Post not found in user matches");
        if (newMatches.length === 1) newMatches.shift();
        else newMatches.splice(postIndex, 1);
        userInfo.matches = newMatches;

        // update user to remove post
        const r2 = await writeUser(userID, userInfo);
        if (r2.type === MessageType.error) throw Error(r2.message);

        // remove userID from post.riders
        const newRiders = post.riders;
        if (!newRiders) throw Error("Error fetching users from post");
        const userIndex = newRiders.indexOf(userID);
        if (userIndex === -1) throw Error("User not found in post riders");
        if (newRiders.length === 1) newRiders.shift();
        newRiders.splice(userIndex, 1);
        post.riders = newRiders;

        // update post to remove user
        const r3 = await writePostData(post);
        if (r3.type !== MessageType.success) throw new Error(r3.message);

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { type: MessageType.error, message: `Error: ${e.message}` };
    }
}

/**
 * Initiates a request for a user to cancel pending match request from a post.
 *
 * @param userID (UserID): The ID of the user requesting to cancel a match request.
 * @param post (PostType): The post the user is trying to cancel a match request for.
 * @returns (SuccessMessage | ErrorMessage)
 */
export async function cancelPendingMatch(
    userID: UserID,
    post: PostType
): Promise<SuccessMessage | ErrorMessage> {
    try {
        // remove postID from user.matches
        const r1 = await getUserOnce(userID);
        if (r1.type !== MessageType.success) throw new Error(r1.message);
        const userInfo = r1.data;
        const newPending = userInfo.pending;
        if (!userInfo || !newPending) throw Error("Error fetching user info");
        const postIndex = newPending.indexOf(post.postID);
        if (postIndex === -1) throw Error("Post not found in user's pending rides");
        if (newPending.length === 1) newPending.shift();
        else newPending.splice(postIndex, 1);
        userInfo.matches = newPending;

        // remove userID from post.pending
        const newRiders = post.pending;
        if (!newRiders) throw Error("Error fetching users from post");
        const userIndex = newRiders.indexOf(userID);
        if (userIndex === -1) throw Error("User not found in post riders");
        if (newRiders.length === 1) newRiders.shift();
        newRiders.splice(userIndex, 1);
        post.pending = newRiders;

        // update user to remove post
        const r3 = await writeUser(userID, userInfo);
        if (r3.type === MessageType.error) throw Error(r3.message);

        // update post to remove user
        const r5 = await writePostData(post);
        if (r5.type !== MessageType.success) throw new Error(r5.message);

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { type: MessageType.error, message: `Error: ${e.message}` };
    }
}

/**
 * Helper function that identifies a request in the request array.
 *
 * @param requests ([UserID, PostID][]): The requests to search for
 * @param request ([UserID, PostID]): The request to locate
 * @returns (number) -1 if not found, the index in requests if found.
 */
export function findRequestIndex(requests: [UserID, PostID][], request: [UserID, PostID]) {
    for (let i = 0; i < requests.length; i++) {
        const req = requests[i];
        if (req[0] == request[0] && req[1] == request[1]) return i;
    }
    return -1;
}

export function comparePosts(a: PostType, b: PostType) {
    if (!compareLengths("riders")) return false;
    if (!compareLengths("pending")) return false;
    return true;

    function compareLengths(att: keyof PostType) {
        const arrA = a[att] as string[] | undefined;
        const arrB = b[att] as string[] | undefined;
        if (!arrA && arrB) return false;
        if (!arrB && arrA) return false;
        if (!arrA && !arrB) return true;
        if (!arrA || !arrB) return false;
        return arrA.length == arrB.length;
    }
}
