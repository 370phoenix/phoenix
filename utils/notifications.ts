import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { ErrorMessage, SuccessMessage, MessageType, getUserOnce, writeUser, UserInfo } from "./auth";
import database, { firebase } from "@react-native-firebase/database";

const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

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
        if (snapshot.exists())
            return {
                type: MessageType.success,
                data: {
                    val,
                },
            };
        else
            return {
                type: MessageType.error,
                message: "Error: push notification token not found.",
            };
    } catch (e: any) {
        return { message: `Error: ${e.message}`, type: MessageType.error };
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
        if (res.type === MessageType.success) tokens.push(res.data);
    }
    return tokens;
}

/**
 * Register current user for push notifications
 *
 * @returns ExpoPushToken for current user
 */
export async function registerForPushNotificationsAsync(userID: string, userInfo: UserInfo) {
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

        // write userID and token pair to database
        await writePushTokenOnce(userID, token);

        // update hasPushToken status in user
        const userRef = database().ref("users/" + userID + "/hasPushToken");
        await userRef.set(true);
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
): Promise<SuccessMessage | ErrorMessage> {
    try {
        if (!userID || !pushToken) throw new Error("No User ID or Push Token.");
        
        const userRef = database().ref("pushTokens/" + userID);
        await userRef.set(pushToken);
        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: MessageType.error };
    }
}
