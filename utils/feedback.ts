import { firebase } from "@react-native-firebase/database";
import { FeedbackEntryType } from "./auth";

const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

export async function pushFeedback(
    feedback: FeedbackEntryType //need to make this different?
): Promise<void> {
    const fbRef = db.ref("feedback/").push();
    await fbRef.set(feedback);
}
