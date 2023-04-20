import { firebase } from "@react-native-firebase/database";
import { FeedbackEntryType } from "./auth";
import { getDB } from "./db";

const dbRef = getDB().ref("feedback/");

export async function pushFeedback(
    feedback: FeedbackEntryType
): Promise<void> {
    const fbRef = dbRef.push();
    await fbRef.set(feedback);
}
