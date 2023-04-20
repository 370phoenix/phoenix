import Filter from "bad-words";
import Pronouns from "../constants/Pronouns.json";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import functions from "@react-native-firebase/functions";
import { Unsubscribe } from "./posts";
import firebase from "@react-native-firebase/app";

///////////////////////////////////////////
///////////////////////////////////////////
//////////////// TYPES ////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
export type UserInfo = {
    userID: string;
    username: string;
    phone: string;
    major: string;
    gradYear: number;
    pronouns: string;
    chillIndex: number | undefined;
    ridesCompleted: number;
    posts: string[] | undefined;
    pending: string[] | undefined;
    matches: string[] | undefined;
    completed: string[] | undefined;
};

export type FBUserInfo = {
    username: string;
    phone: string;
    major: string;
    gradYear: number;
    pronouns: string;
    chillIndex: number | undefined;
    ridesCompleted: number;
    posts: { [key: number]: string } | undefined;
    pending: { [key: number]: string } | undefined;
    matches: { [key: number]: string } | undefined;
    completed: { [key: number]: string } | undefined;
    requests: { [key: number]: { 0: string; 1: string } } | undefined;
    hasPushToken: boolean;
};

export type FeedbackEntryType = {
    message: string;
    postID: string;
    userID: string;
    timestamp: number;
};

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
 *
 * @returns (Promise<ConfirmationResult>): The confirm engine
 * @throws (Error): If phone number is incorrect format
 * @throws (FirebaseError): If Firebase error
 */
export async function getConfirm(
    phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> {
    const fullNumber = "+1" + phoneNumber.replace(/\D/g, "");

    if (fullNumber.length !== 12 || fullNumber.match(/\+\d*/g) === null)
        throw new Error("Phone number incorrect format");

    const confirmation = await auth().signInWithPhoneNumber(fullNumber);
    return confirmation;
}

/**
 * Signs the user in using a OTP
 *
 * @param confirm (ConfirmationResult): The confirm engine
 * @param verificationCode (string): User-entered OTP
 *
 * @returns (Promise<true>): True if successful
 */
export async function signIn(
    confirm: FirebaseAuthTypes.ConfirmationResult,
    verificationCode: string
): Promise<true> {
    await confirm.confirm(verificationCode);
    return true;
}

///////////////////////////////////////////
///////////////////////////////////////////
//////////////// USER DB //////////////////
///////////////////////////////////////////
///////////////////////////////////////////

/**
 * Used to overwrite the user info.
 *
 * @param userID (string | null): The user ID
 * @param userInfo (UserInfo | null): The new user Info
 *
 * @returns (Promise<Void>)
 * @throws (Error): If no user ID or user info
 * @throws (FirebaseError): If Firebase error
 */
export async function writeUser(userID: string | null, userInfo: UserInfo | null): Promise<void> {
    if (!userID || !userInfo) throw new Error("No User ID or Info.");

    const userRef = database().ref("users/" + userID);
    await userRef.set(cleanUndefined(userInfo));
}

function convertUserInfo(userID: string, data: FBUserInfo): UserInfo {
    return {
        ...data,
        userID,
        posts: data.posts ? Object.values(data.posts) : [],
        pending: data.pending ? Object.values(data.pending) : [],
        matches: data.matches ? Object.values(data.matches) : [],
        completed: data.completed ? Object.values(data.completed) : [],
    };
}

/**
 * Get instant updates for user info
 *
 * @param user (User): The user to watch for updates on
 * @param onUpdate ((data: UserInfo) => void) callback to operate on the data
 *
 * @returns (Unsubcribe): An unsubscribe function
 * @throws (Error): If no user ID
 * @throws (FirebaseError): If Firebase error
 */
export function getUserUpdates(userID: string, onUpdate: (data: UserInfo) => void): Unsubscribe {
    const userRef = database().ref("users/" + userID);
    const onChange = userRef.on("value", (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const key = snapshot.key;
            if (!key) throw Error("No userID key");
            onUpdate(convertUserInfo(key, data));
        }
    });
    const unsub = () => {
        userRef.off("value", onChange);
    };
    return unsub;
}

/**
 * Gets multiple users' info only once
 *
 * @param users (string[]): The users to get the info of
 *
 * @returns (Promise<UserInfo[]>): The users' info
 * @throws (Error): If no user info found or Firebase error
 */
export async function getUsersOnce(users: string[]): Promise<UserInfo[]> {
    const info = [];
    for (const user of users) {
        const userInfo = await getUserOnce(user);
        if (!userInfo) throw Error("No user info");
        info.push(userInfo);
    }
    return info;
}

/**
 * Gets a user's info only once
 *
 * @param userID (string): The user to get the info of
 *
 * @returns (SuccessMessage<UserInfo> | ErrorMessage | InfoMessage) Informs there is no data, or returns it if there is.
 * @throws (Error): If no user ID or Firebase error
 */
export async function getUserOnce(userID: string | null): Promise<UserInfo | null> {
    if (!userID) throw Error("No user ID.");
    const userRef = database().ref("users/" + userID);
    const snapshot = await userRef.once("value");
    if (snapshot.exists())
        return {
            userID: userID,
            ...snapshot.val(),
        };
    return null;
}

/**
 * Delete a user's account info in the db.
 *
 * @param user (User): The user who's info to delete.
 *
 * @returns (SuccessMessage | ErrorMessage)
 * @throws (FirebaseError): If Firebase error
 */
export async function deleteAccount(): Promise<void> {
    await functions().httpsCallable("deleteUser")();
    await auth().signOut();
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
    pronouns: string;
    phone?: string | null;
    userInfo?: UserInfo | null;
    userID?: string | null;
};
/**
 * Checks to see if user info is valid, and returns a clean version.
 *
 * @param param0 (ValidateProfileParams): inputs to validate
 * @returns (UserInfo): The cleaned user info
 *
 * @throws (Error): If validation fails
 */
export function validateProfile({
    username,
    major,
    pronouns,
    gradString,
    userID = null,
    phone = null,
    userInfo = null,
}: ValidateProfileParams): UserInfo {
    const noUserError = "Must supply either phone or previous user info.";
    console.log(!phone && !userInfo);
    if (!phone && !userInfo) throw new Error(noUserError);

    const filter = new Filter();

    if (filter.isProfane(username)) throw new Error("Display name cannot be profane.");

    if (filter.isProfane(major)) throw new Error("Major cannot be profane.");

    if (!Pronouns.includes(pronouns))
        throw new Error("Pronouns not accepted. Please email us if we've made a mistake.");

    if (gradString.match(/\D/g) !== null)
        throw new Error("Please make sure grad year is all digits.");

    const gradYear = Number(gradString);
    if (userInfo)
        // Changing Info
        return {
            username,
            major,
            //hasPushToken,
            pronouns,
            gradYear,
            userID: userInfo.userID,
            phone: userInfo.phone,
            chillIndex: userInfo.chillIndex,
            ridesCompleted: userInfo.ridesCompleted ? userInfo.ridesCompleted : 0,
            posts: userInfo.posts ? userInfo.posts : [],
            pending: userInfo.pending ? userInfo.pending : [],
            matches: userInfo.matches ? userInfo.matches : [],
            completed: userInfo.completed ? userInfo.completed : [],
        };
    else if (phone && userID) {
        // Inital Profile Setup
        return {
            userID,
            chillIndex: undefined,
            username,
            major,
            pronouns,
            gradYear,
            phone,
            //hasPushToken,
            ridesCompleted: 0,
            posts: [],
            pending: [],
            matches: [],
            completed: [],
        };
    } else throw noUserError;
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
