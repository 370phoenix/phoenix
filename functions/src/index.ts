import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { removePosts } from "./posts";

admin.initializeApp();

export const clearCompleted = functions.pubsub
    .schedule("0 0 * * *")
    .timeZone("America/New_York")
    .onRun(async () => {
        await removePosts();
    });

export const clearOnDemand = functions.https.onRequest(async () => {
    await removePosts();
});
