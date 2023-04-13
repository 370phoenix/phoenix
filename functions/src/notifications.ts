import * as admin from "firebase-admin";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

//////////////////////////////////////////
//////////////////////////////////////////
/////////// NOTIFICATIONS ////////////////
//////////////////////////////////////////
//////////////////////////////////////////

const db = admin.database();

/**
 * Send push notifications for accepted requests when listener detects update
 */
export async function sendCancelNotifications(postID: string) {
    try {
        const snapshot = await db.ref("posts/" + postID).get();
        if (!snapshot) throw Error("Error fetching post\n");
        const post = snapshot.val();
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
    try {
        const r1 = await getPushToken(userID);
        const token = r1.data;
        const snapshot = await db.ref("posts/" + postID).get();
        if (!snapshot) throw Error("Error fetching post\n");
        const post = snapshot.val();
        const dropoff = post.dropoff;
        const title = "Match Request Accepted!";
        const body = `Your matched on a ride to ${dropoff}! To view more details, open the FareShare app.`;
        sendOneNotification(token, title, body);
    } catch (e: any) {
        console.error(`Error: ${e.message}`);
    }
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

export async function onRidersChanged(change: any, context: any) {
    try {
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
        return true;
    } catch (e: any) {
        console.error(`Error in DELETE POSTS: ${e.message}`);
        return false;
    }
}


/**
 * Get push token for given user
 *
 * @param userID
 * @returns ExpoPushToken for given user
 */
export async function getPushToken(userID: string): Promise<any> {
    try {
        const snapshot = await db.ref("pushTokens/" + userID).once("value");
        const val = snapshot.val();
        if (snapshot.exists()) return {type: "Success", data: val};
        else throw Error("Error fetching push token from DB");
    } catch (e: any) {
        return {type: "Error", message: `Error: ${e.message}`};
    }
}

/**
 * Get push tokens for multiple users
 *
 * @param users An array of userIDs
 * @returns array of ExpoPushTokens for given users
 */
export async function getMultiplePushTokens(users: string[]): Promise<string[]> {
    const tokens: string[] = [];
    for (const user of users) {
        const res = await getPushToken(user);
        if (res.type === "Success") tokens.push(res.data);
    }
    return tokens;
}

/**
 * Register current user for push notifications
 *
 * @returns ExpoPushToken for current user
 */
export async function registerForPushNotificationsAsync(userID: string, userInfo: any) {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            console.warn("Failed to get push token for push notification!");
            return;
        }
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
            });
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;

        if(!token) throw Error("Error getting push token");

        // write userID and token pair to database
        await writePushTokenOnce(userID, token);

        // update hasPushToken status in user
        const tokenRef = db.ref("users/" + userID + "/hasPushToken");
        await tokenRef.set(true);
        console.log("Success! User push token generated");

    } else {
        console.warn("Must use physical device for Push Notifications");
    }

    return token;
}

// write token to pushTokens object in database
export async function writePushTokenOnce(
    userID: string | null,
    pushToken: string | null
): Promise<any> {
    try {
        if (!userID || !pushToken) throw new Error("No User ID or Push Token.");
        
        const userRef = db.ref("pushTokens/" + userID);
        await userRef.set(pushToken);
        return { type: "Success", data: undefined };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: "Error" };
    }
}
