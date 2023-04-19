import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDB } from "./posts";

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

export async function loadCache(postID: string, header: ChatHeader | null) {
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
    postID: string,
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

export async function loadMessages(postID: string) {
    const messages = await getDB().ref(`messages/${postID}`).once("value");
    if (!messages.exists()) return [];

    const messageList = Object.values(messages.val()) as ChatMessage[];
    messageList.sort((a, b) => a.timestamp - b.timestamp);
    return messageList;
}

export async function sendMessage(postID: string, message: ChatMessage) {
    try {
        // Add message to database
        await getDB().ref(`messages/${postID}`).push().set(message);

        // Update last message
        await getDB().ref(`chats/${postID}`).update({ lastMessage: message });
        return message;
    } catch (error: any) {
        return error.message;
    }
}
