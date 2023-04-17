import { firebase } from "@react-native-firebase/database";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { get } from "http";
import { Platform } from "react-native";
const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

/**
 * Register current user for push notifications
 *
 * @returns ExpoPushToken for current user
 */
export async function registerForPushNotificationsAsync(userID: string, userInfo: any) {
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

        if (!token) throw Error("Error getting push token");

        // compare current token in db, override if different
        const res = await getPushToken(userID);
        if (res.type === "Success") {
            const oldToken = res.data;
            if (oldToken === token) {
                return token;
            }
        }
        // write userID and token pair to database
        await writePushTokenOnce(userID, token);
    } else {
        console.warn("Must use physical device for Push Notifications");
    }

    return token;
}

// read current push token from db
async function getPushToken(userID: string): Promise<any> {
    try {
        if (!userID) throw new Error("No User ID for get push token");

        const userRef = db.ref("pushTokens/" + userID);
        const snapshot = await userRef.once("value");
        if (snapshot.exists()) {
            const token = snapshot.val();
            return { type: "Success", data: token };
        }
        throw Error("Token does not exist in DB");
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: "Error" };
    }
}

// write token to pushTokens object in database
async function writePushTokenOnce(userID: string | null, pushToken: string | null): Promise<any> {
    try {
        if (!userID || !pushToken) throw new Error("No User ID or Push Token.");

        const userRef = db.ref("pushTokens/" + userID);
        await userRef.set(pushToken);
        return { type: "Success", data: undefined };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: "Error" };
    }
}
