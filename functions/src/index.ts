import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { PostType } from "../../constants/DataTypes";
import { fetchPost } from "../../utils/posts";
import { MessageType } from "../../utils/auth";
import { getMultiplePushTokens, getPushToken } from "../../utils/notifications";
import { removePosts } from "./posts";

admin.initializeApp();

export const ridersChangedNotification = functions.database
    .ref("/posts/{postID}/riders")
    .onUpdate((change, context) => {
        const { postID } = context.params;

        // before = rider array before update, after = rider array after update
        const before = change.before.val();
        const after = change.after.val();

        // more riders than before, someone has matched
        if (after.length > before.length) {
            // notify the person who has matched (userID which is in after but not before)
            const newRiders = after.filter((x: string) => !before.includes(x));
            for (const newRider of newRiders) {
                sendAcceptNotification(postID, newRider);
            }
        }

        // fewer riders than before, someone has cancelled
        else if (after.length < before.length) {
            sendCancelNotifications(postID);
        }

    });

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

//////////////////////////////////////////
//////////////////////////////////////////
/////////// NOTIFICATIONS ////////////////
//////////////////////////////////////////
//////////////////////////////////////////

/**
 * Send push notifications for accepted requests when listener detects update
 */
export async function sendCancelNotifications(postID: string) {
    try {
        const r1 = await fetchPost(postID);
        if (r1.type !== MessageType.success) {
            throw Error("Error fetching post data");
        }
        const post = r1.data;
        const dropoff = post.dropoff;
        // remaining riders matched with post should be notified of cancellation
        const riders = post.riders;
        if (!riders) return;

        // get tokens from user IDs
        const tokens = await getMultiplePushTokens(riders);
        // send notification to each user

        const title = "Rider Cancellation";
        const body = `Someone canceled their match with your ride to ${dropoff}. To view more details, open the FareShare app.`;

        for (const token of tokens) {
            sendOneNotification(token, title, body);
        }
    } catch (e: any) {
        console.warn(`Error: ${e}`);
    }
}

/**
 * Send push notifications for accepted requests when listener detects update
 */
async function sendAcceptNotification(postID: string, userID: string) {
    const r1 = await getPushToken(userID);
    if (r1.type !== MessageType.success) throw Error("Error fetching push token");
    const token = r1.data;

    const r2 = await fetchPost(postID);
    if (r2.type !== MessageType.success) throw Error("Error fetching post data");
    const dropoff = r2.data.dropoff;

    const title = "Match Request Accepted!";
    const body = `Your matched on a ride to ${dropoff}! To view more details, open the FareShare app.`;

    sendOneNotification(token, title, body);
}

/**
 * Skeleton for sending push notification using Expo API
 */
async function sendOneNotification(expoPushToken: string, title: string, body: string) {
    const message = {
        to: expoPushToken,
        title,
        body,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
}
