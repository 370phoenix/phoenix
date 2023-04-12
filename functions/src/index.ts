import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { removePosts } from "./posts";
import { onRidersChanged } from "./notifications";

admin.initializeApp();

export const ridersChangedNotification = functions.database
    .ref("/posts/{postID}/riders")
    .onUpdate((change, context) => onRidersChanged(change, context));

export const clearCompleted = functions.pubsub
    .schedule("0 0 * * *")
    .timeZone("America/New_York")
    .onRun(async () => {
        const res = await removePosts();
        if (res) console.log("Posts removed");
        else console.error("Error removing posts");
    });

export const clearOnDemand = functions.https.onRequest(async (_req, res) => {
    const r1 = await removePosts();
    if (r1) {
        console.log("Posts removed");
        res.status(200).send("Posts removed");
    } else {
        console.error("Error removing posts");
        res.status(500).send("Error removing posts");
    }
});

async function deletePost(postID: string, userID: string, userInfo: UserInfo) {
    try {
        console.log(userInfo);
        const db = admin.database();

        const postRef = db.ref("posts/" + postID);
        await postRef.remove();

        let newPosts = userInfo.posts ? userInfo.posts : [];
        if (newPosts.length == 1) newPosts = [];
        else {
            const i = newPosts.indexOf(postID);
            if (i !== -1) newPosts.splice(i, 1);
        }
        userInfo.posts = newPosts;

        const res = await writeUser(userID, userInfo);

        if (typeof res === "string") throw Error(res);

        return true;
    } catch (e: any) {
        return e.message;
    }
}

async function writeUser(userID: string, userInfo: UserInfo) {
    try {
        if (!userID || !userInfo) throw new Error("No User ID or Info.");

        const db = admin.database();
        const userRef = db.ref("users/" + userID);
        await userRef.set(cleanUndefined(userInfo));
        return true;
    } catch (e: any) {
        return e.message;
    }
}

export async function getUserOnce(userID: string | null): Promise<UserInfo> {
    try {
        const db = admin.database();
        if (!userID) throw Error("No user ID.");
        const userRef = db.ref("users/" + userID);
        const snapshot = await userRef.once("value");
        console.log(snapshot.exists());
        if (snapshot.exists()) return snapshot.val();
        throw Error("No info stored");
    } catch (e: any) {
        return e.message;
    }
}

type UserInfo = {
    username: string;
    phone: string;
    major: string;
    gradYear: number;
    pronouns: string;
    chillIndex: number | undefined;
    ridesCompleted: number;
    posts: string[] | undefined;
    pending: string[] | undefined;
    matches: string[] | undefined;
    requests: [string, string][];
};

type Clean<T> = {
    [K in keyof T]?: any;
};

function cleanUndefined<T extends object>(obj: T): T {
    let clean: Clean<T> = {};
    for (const k in obj) {
        if (obj[k]) clean[k] = obj[k];
    }
    return clean as T;
}
