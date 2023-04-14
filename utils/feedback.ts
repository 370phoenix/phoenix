import { firebase } from "@react-native-firebase/database";
import { SuccessMessage, ErrorMessage, MessageType } from "./auth";
import { FeedbackEntryType } from "../constants/DataTypes";
import { UserID, PostID } from "../constants/DataTypes";

const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

export async function pushFeedback(
    feedback: FeedbackEntryType
): Promise<SuccessMessage | ErrorMessage> {
    try {
        //if (!userID) throw Error("No user signed in.");
        //if (!userInfo) throw Error("No user info found.");

        const fbRef = db.ref("feedback/").push();
        await fbRef.set(feedback);
        // if (!fbRef.key) throw new Error("No key generated.");
        // const fbID = fbRef.key;
        // const newFeedback: FeedbackEntryType = {
        //     ...feedback,
        //     //fbID,
        // };
        // await fbRef.set(newFeedback);

        // const fbs: fbID[] = userInfo.posts ? userInfo.posts : [];
        // fbID.push(fbID);
        // userInfo.posts = posts;
        // const r2 = await writeUser(userID, userInfo);
        // if (r2.type === MessageType.error) throw Error(`Error setting user data: ${r2.message}`);

        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        console.log(`Error in Write user Data: ${e.message}`);
        return { message: "Error: " + e.message, type: MessageType.error };
    }
}
