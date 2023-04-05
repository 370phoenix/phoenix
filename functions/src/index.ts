import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { removePosts } from "./posts";

admin.initializeApp();

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
