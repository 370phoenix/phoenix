import { getDB } from "./db";
import { UserInfo } from "./userValidation";
import { getUserOnce, writeUser } from "./auth";
import * as Clipboard from "expo-clipboard";

import { safeRun } from "./errorHandling";
import {
    FBPostType,
    FirebasePostSchema,
    FreshPostType,
    PostSchema,
    PostToFBSchema,
    PostType,
} from "./postValidation";

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
 * @returns (Promise<PostType[]>) Posts or an Error Message.
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
    if (userInfo.posts) userInfo.posts[postID] = true;
    else userInfo.posts = { [postID]: true };
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
