import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "@react-native-firebase/database";

import { PostID } from "../constants/DataTypes";

const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

/////////////////////////////////
/////////////////////////////////
///////////// TYPES /////////////
/////////////////////////////////
/////////////////////////////////

export type MessageCache = {
    header: ChatHeader;
    messages?: ChatMessage[];
};
export type ChatMessage = {
    uid: string; // UID of sender
    message: string; // Message
    timestamp: number; // Unix timestamp
};
export type ChatHeader = {
    postID: string; // ID of post
    title: string; // Title of chat
    displayNames: {
        [uid: string]: string; // UID to display name
    };
    lastMessage: ChatMessage | undefined; // Last message sent
};

/////////////////////////////////
/////////////////////////////////
//////////// CACHE //////////////
/////////////////////////////////
/////////////////////////////////

export async function loadCache(postID: PostID, header: ChatHeader | null) {
    if (!header) throw new Error("No chat header");

    const keys = await AsyncStorage.getAllKeys();
    const exists = keys.includes(postID);
    if (!exists) return false;

    // Parse message cache
    const stringed = await AsyncStorage.getItem(postID);
    if (!stringed) return false;
    const messageCache = JSON.parse(stringed) as MessageCache;

    // Check cache freshness
    if (!header.lastMessage) return [];
    if (messageCache.header.lastMessage?.timestamp !== header.lastMessage.timestamp) return false;

    if (messageCache.messages) return messageCache.messages;
    return false;
}

export async function cacheMessages(
    postID: PostID,
    messages: ChatMessage[],
    header: ChatHeader | null
) {
    if (!header) throw new Error("No chat header");
    const messageCache: MessageCache = {
        header,
        messages,
    };
    await AsyncStorage.setItem(postID, JSON.stringify(messageCache));
}

/////////////////////////////////
/////////////////////////////////
//////////// FIREBASE ///////////
/////////////////////////////////
/////////////////////////////////

export async function loadMessages(postID: PostID) {
    const messages = await db.ref(`messages/${postID}`).once("value");
    if (!messages.exists()) return [];

    const messageList = messages.val() as ChatMessage[];
    return messageList;
}

export async function sendMessage(postID: PostID, message: ChatMessage) {
    try {
        await db.ref(`messages/${postID}`).push().set(message);
        return true;
    } catch (error: any) {
        return error.message;
    }
}
