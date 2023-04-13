import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { onRidersChanged } from "./notifications";
import { removePosts } from "./posts";

admin.initializeApp();

export const ridersChangedNotification = functions.database
    .ref("/posts/{postID}/riders")
    .onUpdate(async (change, context) => {
        const res = await onRidersChanged(change, context);
        if(res) console.log("Rider change notification sent");
        else console.error("Error sending rider change notification");
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
