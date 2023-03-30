import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { ErrorMessage, SuccessMessage, MessageType } from "../auth";
import { firebase } from "@react-native-firebase/database";


const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

/**
 * Register current user for push notifications
 * 
 * @param userID the userID of the user getting notified
 * @returns ExpoPushToken for given user
 */
export async function getPushToken(userID: string) {
    try {
        const snapshot = await db.ref("pushTokens/" + userID).once("value");
        const val = snapshot.val();
        if (snapshot.exists())
            return {
                type: MessageType.success,
                data: {
                    val
                },
            };
        else return { type: MessageType.error, message: "Error: push notification token not found." };
    } catch (e: any) {
        return { message: `Error: ${e.message}`, type: MessageType.error };
    }
}

/**
 * Register current user for push notifications
 *
 * @returns ExpoPushToken for current user
 */
export async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
        }
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
            });
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert("Must use physical device for Push Notifications");
    }

    return token;
}

