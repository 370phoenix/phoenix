import { firebase } from "@react-native-firebase/database";
import { SuccessMessage, ErrorMessage, MessageType } from "./auth"; //didnt we get rid of this?
import { getUserOnce } from "./auth"; //does this substitute for the line above?^
// import { FeedbackEntryType } from "../constants/DataTypes";
// import { UserID, PostID } from "../constants/DataTypes";
import { TouchableNativeFeedback } from "react-native";

const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

export async function pushFeedback(
    feedback: FeedbackEntryType //need to make this different?
): Promise<SuccessMessage | ErrorMessage> {
    try {
        const fbRef = db.ref("feedback/").push();
        await fbRef.set(feedback);

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        console.log(`Error in Write user Data: ${e.message}`);
        return { message: "Error: " + e.message, type: MessageType.error };
    }
}
