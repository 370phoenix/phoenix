import * as functions from "firebase-functions";
import { getMultiplePushTokens, getPushToken } from "../../utils/notifications";
import { MessageType } from "../../utils/auth";
import { fetchPost } from "../../utils/posts";

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

export function onRidersChanged(change: any, context: any) {
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
    };