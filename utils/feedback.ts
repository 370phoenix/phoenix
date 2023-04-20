import { FeedbackEntryType } from "./auth";
import { getDB } from "./db";

export async function pushFeedback(feedback: FeedbackEntryType): Promise<void> {
    const fbRef = getDB().ref("feedback/").push();
    await fbRef.set(feedback);
}
