import { firebase } from "@react-native-firebase/database";
import * as Clipboard from "expo-clipboard";

import { getUserOnce, UserInfo, writeUser } from "./auth";
import { safeRun } from "./errorHandling";
import {
    FBPostType,
    FirebasePostSchema,
    FreshPostType,
    PostSchema,
    PostToFBSchema,
    PostType,
} from "./postValidation";

export const getDB = () => {
    if (__DEV__) {
        return firebase.app().database("https://phoenix-370-test.firebaseio.com");
    } else {
        return firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");
    }
};

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
export async function fetchPost(postID: string): Promise<PostType> {
    const snapshot = await getDB()
        .ref("posts/" + postID)
        .once("value");
    if (snapshot.exists()) return valToPost(snapshot.val());
    else throw Error("Post does not exist.");
}

/**
 * Fetch some number of posts.
 *
 * @param ids (PostID[]): Array of ids to fetch
 * @returns (Success<PostType[] | ErrorMessage) Posts or an Error Message.
 *
 * @throws Error from Firebase
 */
export async function fetchSomePosts(ids: string[]): Promise<PostType[]> {
    const postsRef = getDB().ref("posts");
    const posts: PostType[] = [];

    for (const id of ids) {
        if (!id) continue;
        const postRef = postsRef.child(id);
        const snapshot = await postRef.once("value");
        if (snapshot.exists()) {
            safeRun(() => {
                posts.push(valToPost(snapshot.val()));
            });
        }
    }

    return posts;
}

type PostUpdateParams = {
    onChildChanged: (data: PostType) => void;
    onChildAdded: (data: PostType) => void;
    onChildRemoved: (data: PostType) => void;
};
/**
 * Get all post updates.
 *
 * @param onChildAdded (PostType => void): Callback for when a post is added.
 * @param onChildChanged (PostType => void): Callback for when a post is changed.
 * @param onChildRemoved (PostType => void): Callback for when a post is removed.
 *
 * @returns (Unsubscribe): Function to unsubscribe from all updates.
 * @throws Error from Firebase
 */
export function getAllPostUpdates({
    onChildAdded,
    onChildChanged,
    onChildRemoved,
}: PostUpdateParams): Unsubscribe {
    const postsRef = getDB().ref("posts");

    const onAdd = postsRef.on(
        "child_added",
        (snapshot) => {
            if (snapshot.exists()) {
                safeRun(() => {
                    onChildAdded(valToPost(snapshot.val()));
                });
            }
        },
        (_) => {} // TODO: HANDLE (ERROR) => {}
    );

    const onChange = postsRef.on(
        "child_changed",
        (snapshot) => {
            if (snapshot.exists()) {
                safeRun(() => {
                    onChildChanged(valToPost(snapshot.val()));
                });
            }
        },
        (_) => {} // TODO: HANDLE (ERROR) => {}
    );

    const onRemove = postsRef.on("child_removed", (snapshot) => {
        if (snapshot.exists()) {
            safeRun(() => {
                onChildRemoved(valToPost(snapshot.val()));
            });
        }
    });

    return () => {
        postsRef.off("child_added", onAdd);
        postsRef.off("child_changed", onChange);
        postsRef.off("child_removed", onRemove);
    };
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
 *
 * @returns (SuccessMessage | ErrorMessage)
 * @throws (FirebaseError | ZodError) from Firebase or validation
 */
export async function createPost(post: FreshPostType, userInfo: UserInfo | null): Promise<void> {
    if (!userInfo) throw Error("No user info found.");
    const { user: userID } = post;

    // Add post to DB
    const postRef = getDB().ref("posts/").push();
    if (!postRef.key) throw new Error("No key generated.");
    const postID = postRef.key;
    const newPost: FBPostType = FirebasePostSchema.parse({ postID, ...post });
    await postRef.set(newPost);

    // Add post to user info
    const posts: string[] = userInfo.posts ? userInfo.posts : [];
    posts.push(postID);
    userInfo.posts = posts;
    await writeUser(userID, userInfo);

    // Add a chat header
    await getDB()
        .ref(`chats/${postID}`)
        .set({
            postID,
            title: post.dropoff,
            displayNames: { [userID]: userInfo.username },
            lastMessage: undefined,
        });
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
 * @returns (Promise<void>)
 *
 * @throws (FirebaseError) from Firebase
 */
export async function writePostData(post: PostType): Promise<void> {
    const postRef = getDB().ref("posts/" + post.postID);
    await postRef.set(PostToFBSchema.parse(post));
}

type ARParams = {
    isAccept: boolean;
    userInfo: UserInfo | null;
    requesterID: string;
    requesterInfo: UserInfo | null;
    posterID: string;
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
 *
 * @returns (Proimse<PostType>) The new post data.
 * @throws (FirebaseError | Error) from Firebase or validation
 */
export async function handleAcceptReject({
    isAccept,
    userInfo,
    requesterID,
    requesterInfo,
    post,
}: ARParams): Promise<PostType> {
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
    await writeUser(requesterID, requesterInfo);

    // Update Post Info
    // Remove from post pending for accept or deny
    if (post.pending) {
        const j = post.pending.indexOf(requesterID);
        if (j != -1 && post.pending) post.pending.splice(j, 1);
    }
    // Add to post riders if accept
    if (isAccept) post.riders = post.riders ? [...post.riders, requesterID] : [requesterID];
    await writePostData(post);

    if (isAccept) {
        console.log(`Adding ${requesterInfo.username} to chat ${postID}`);
        await getDB()
            .ref(`chats/${postID}/displayNames/${requesterID}`)
            .set(requesterInfo.username);
    }
    return post;
}

/**
 * Initiates a request for a user to match on a post after pressing the match button.
 *
 * @param userID (UserID): The ID of the user requesting to match on the ride.
 * @param post (PostType): The post the user is trying to match on.
 *
 * @returns (SuccessMessage | ErrorMessage)
 * @throws (FirebaseError | Error) from Firebase or validation
 */
export async function matchPost(userID: string, post: PostType): Promise<void> {
    // Get Requester Info
    const requesterInfo = await getUserOnce(userID);
    if (!requesterInfo) throw new Error("No requester info found.");

    // Update requester to have pending
    requesterInfo.pending = requesterInfo.pending
        ? [...requesterInfo.pending, post.postID]
        : [post.postID];
    await writeUser(userID, requesterInfo);

    // Update Post Info to have pending
    post.pending = post.pending ? [...post.pending, userID] : [userID];
    await writePostData(post);
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
 *
 * @throws (FirebaseError | Error) from Firebase or validation
 */
export async function unmatchPost(userID: string, post: PostType): Promise<void> {
    // remove postID from user.matches
    const userInfo = await getUserOnce(userID);
    if (!userInfo) throw new Error("No user info found.");

    const newMatches = userInfo.matches;
    if (!newMatches) throw Error("Error fetching user matches");

    const postIndex = newMatches.indexOf(post.postID);
    if (postIndex === -1) throw Error("Post not found in user matches");

    if (newMatches.length === 1) newMatches.shift();
    else newMatches.splice(postIndex, 1);
    userInfo.matches = newMatches;

    // update user to remove post
    await writeUser(userID, userInfo);

    // remove userID from post.riders
    const newRiders = post.riders;
    if (!newRiders) throw Error("Error fetching users from post");

    const userIndex = newRiders.indexOf(userID);
    if (userIndex === -1) throw Error("User not found in post riders");
    if (newRiders.length === 1) newRiders.shift();
    newRiders.splice(userIndex, 1);
    post.riders = newRiders;

    // update post to remove user
    await writePostData(post);
}

function valToPost(val: any) {
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
        riders: val.riders,
        pending: val.pending,
    });
}

export async function copyToClipboard(text: string) {
    await Clipboard.setStringAsync(text);
}
