import Filter from "bad-words";
import Genders from "../constants/Genders.json";
import { PostID, UserID } from "../constants/DataTypes";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import { Unsubscribe } from "./posts";

///////////////////////////////////////////
///////////////////////////////////////////
//////////////// TYPES ////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
export type UserInfo = {
    username: string;
    phone: string;
    major: string;
    gradYear: number;
    gender: string;
    chillIndex: number | null;
    ridesCompleted: number;
    posts: PostID[] | undefined;
    pending: PostID[] | undefined;
    matches: PostID[] | undefined;
    requests: [UserID, PostID][];
};

// MESSAGES //
export enum MessageType {
    error,
    info,
    success,
}
export type SuccessMessage<T = undefined> = {
    message?: string;
    data: T;
    type: MessageType.success;
};
export type ErrorMessage = {
    message: string;
    type: MessageType.error;
};
export type InfoMessage = {
    message: string;
    type: MessageType.info;
};
export type Message<T> = SuccessMessage<T> | ErrorMessage | InfoMessage;

// For helper method cleanUndefined
type Clean<T> = {
    [K in keyof T]?: any;
};

///////////////////////////////////////////
///////////////////////////////////////////
//////////////// SIGN IN //////////////////
///////////////////////////////////////////
///////////////////////////////////////////

/**
 * Initiates the phone verification process
 *
 * @param phoneNumber (string): The user's phone number
 * @returns (SucessMessage<ConfirmationResult> | ErrorMessage): The confirm engine
 */
export async function getConfirm(
    phoneNumber: string
): Promise<SuccessMessage<FirebaseAuthTypes.ConfirmationResult> | ErrorMessage> {
    try {
        const fullNumber = "+1" + phoneNumber.replace(/\D/g, "");

        if (fullNumber.length !== 12 || fullNumber.match(/\+\d*/g) === null)
            throw new Error("Phone number incorrect format");

        const confirmation = await auth().signInWithPhoneNumber(fullNumber);
        return { data: confirmation, type: MessageType.success };
    } catch (e: any) {
        return { message: `Error verifying phone number: ${e.message}`, type: MessageType.error };
    }
}

/**
 * Signs the user in using a OTP
 *
 * @param confirm (ConfirmationResult): The confirm engine
 * @param verificationCode (string): User-entered OTP
 * @returns (SuccessMessage | ErrorMessage)
 */
export async function signIn(
    confirm: FirebaseAuthTypes.ConfirmationResult,
    verificationCode: string
): Promise<SuccessMessage | ErrorMessage> {
    try {
        await confirm.confirm(verificationCode);
        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { message: `Error: ${e.message}`, type: MessageType.error };
    }
}

///////////////////////////////////////////
///////////////////////////////////////////
//////////////// USER DB //////////////////
///////////////////////////////////////////
///////////////////////////////////////////

/**
 * Used to overwrite the user info.
 *
 * @param userID (UserID): The user ID
 * @param userInfo (UserInfo): The new user Info
 * @returns (SuccessMessage | ErrorMessage)
 */
export async function writeUser(
    userID: string,
    userInfo: UserInfo
): Promise<SuccessMessage | ErrorMessage> {
    try {
        const userRef = database().ref("users/" + userID);
        await userRef.set(cleanUndefined(userInfo));
        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: MessageType.error };
    }
}

/**
 * Get instant updates for user info
 *
 * @param user (User): The user to watch for updates on
 * @param onUpdate ((data: UserInfo) => void) callback to operate on the data
 * @returns (SuccessMessage<Unsubscribe> | ErrorMessage): An unsubscribe function
 */
export function getUserUpdates(
    user: FirebaseAuthTypes.User,
    onUpdate: (data: UserInfo) => void
): SuccessMessage<Unsubscribe> | ErrorMessage {
    try {
        const userRef = database().ref("users/" + user.uid);
        const onChange = userRef.on("value", (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                onUpdate(data);
            }
        });
        const unsub = () => userRef.off("value", onChange);
        return { message: "Listener attached.", type: MessageType.success, data: unsub };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: MessageType.error };
    }
}

/**
 * Gets a user's info only once
 *
 * @param userID (UserID): The user to get the info of
 * @returns (SuccessMessage<UserInfo> | ErrorMessage | InfoMessage) Informs there is no data, or returns it if there is.
 */
export async function getUserOnce(userID: UserID): Promise<Message<UserInfo>> {
    try {
        const userRef = database().ref("users/" + userID);
        const snapshot = await userRef.once("value");
        if (snapshot.exists()) return { data: snapshot.val(), type: MessageType.success };
        return { message: "User does not have information stored.", type: MessageType.info };
    } catch (e: any) {
        return { message: `Error: ${e.message}`, type: MessageType.error };
    }
}

/**
 * Delete a user's account info in the db.
 *
 * @param user (User): The user who's info to delete.
 * @returns (SuccessMessage | ErrorMessage)
 */
export async function deleteAccount(
    user: FirebaseAuthTypes.User
): Promise<SuccessMessage | ErrorMessage> {
    try {
        const userRef = database().ref("users/" + user.uid);
        await userRef.remove();
        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: MessageType.error };
    }
}

///////////////////////////////////////////
///////////////////////////////////////////
//////////////// VALIDATION ///////////////
///////////////////////////////////////////
///////////////////////////////////////////

type ValidateProfileParams = {
    username: string;
    major: string;
    gradString: string;
    gender: string;
    phone?: string | null;
    userInfo?: UserInfo | null;
};
/**
 * Checks to see if user info is valid, and returns a clean version.
 *
 * @param param0 (ValidateProfileParams): inputs to validate
 * @returns (SuccessMessage<UserInfo> | ErrorMessage)
 */
export function validateProfile({
    username,
    major,
    gender,
    gradString,
    phone = null,
    userInfo = null,
}: ValidateProfileParams): SuccessMessage<UserInfo> | ErrorMessage {
    try {
        const noUserError: ErrorMessage = {
            type: MessageType.error,
            message: "Must supply either phone or previous user info.",
        };
        if (!(phone || userInfo)) return noUserError;

        const filter = new Filter();

        if (filter.isProfane(username))
            return { type: MessageType.error, message: "Display name cannot be profane." };

        if (filter.isProfane(major))
            return { type: MessageType.error, message: "Major cannot be profane." };

        if (!Genders.includes(gender.toLowerCase()))
            return {
                type: MessageType.error,
                message: "Gender not accepted. Please email us if we've made a mistake.",
            };

        if (gradString.match(/\D/g) !== null)
            return {
                type: MessageType.error,
                message: "Please make sure grad year is all digits.",
            };

        const gradYear = Number(gradString);
        if (userInfo)
            // Changing Info
            return {
                type: MessageType.success,
                data: {
                    username: username,
                    major: major,
                    gender: gender,
                    gradYear: gradYear,
                    phone: userInfo.phone,
                    chillIndex: userInfo.chillIndex,
                    ridesCompleted: userInfo.ridesCompleted,
                    posts: userInfo.posts ? userInfo.posts : [],
                    pending: userInfo.pending ? userInfo.pending : [],
                    matches: userInfo.matches ? userInfo.matches : [],
                    requests: userInfo.requests ? userInfo.requests : [],
                },
            };
        else if (phone) {
            // Inital Profile Setup
            return {
                type: MessageType.success,
                data: {
                    username: username,
                    major: major,
                    gender: gender,
                    gradYear: gradYear,
                    phone: phone,
                    chillIndex: null,
                    ridesCompleted: 0,
                    posts: [],
                    pending: [],
                    matches: [],
                    requests: [],
                },
            };
        } else return noUserError;
    } catch (e: any) {
        return { type: MessageType.error, message: `Error: ${e.message}` };
    }
}

///////////////////////////////////////////
///////////////////////////////////////////
//////////////// HELPERS //////////////////
///////////////////////////////////////////
///////////////////////////////////////////

/**
 * Get's rid of any undefined fields in obj.
 *
 * @param obj (T): An object to clean
 * @returns (T): The clean object
 */
function cleanUndefined<T extends object>(obj: T): T {
    let clean: Clean<T> = {};
    for (const k in obj) {
        if (obj[k]) clean[k] = obj[k];
    }
    return clean as T;
}
