import Filter from "bad-words";
import Pronouns from "../constants/Pronouns.json";
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
    userID: UserID;
    username: string;
    phone: string;
    major: string;
    gradYear: number;
    pronouns: string;
    chillIndex: number | undefined;
    ridesCompleted: number;
    posts: PostID[] | undefined;
    pending: PostID[] | undefined;
    matches: PostID[] | undefined;
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
 * @returns (SuccessMessage | ErrorMessage)
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
 * @param userID (UserID): The user ID
 * @param userInfo (UserInfo): The new user Info
 * @returns (SuccessMessage | ErrorMessage)
 */
export async function writeUser(
    userID: string | null,
    userInfo: UserInfo | null
): Promise<SuccessMessage | ErrorMessage> {
    try {
        if (!userID || !userInfo) throw new Error("No User ID or Info.");

        const userRef = database().ref("users/" + userID);
        await userRef.set(cleanUndefined(userInfo));
        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: MessageType.error };
    }
}

function convertUserInfo(userID: UserID, data: FBUserInfo): UserInfo {
    return {
        ...data,
        userID,
        posts: data.posts ? Object.values(data.posts) : [],
        pending: data.pending ? Object.values(data.pending) : [],
        matches: data.matches ? Object.values(data.matches) : [],
    };
}

/**
 * Get instant updates for user info
 *
 * @param user (User): The user to watch for updates on
 * @param onUpdate ((data: UserInfo) => void) callback to operate on the data
 * @returns (SuccessMessage<Unsubscribe> | ErrorMessage): An unsubscribe function
 */
export function getUserUpdates(
    userID: UserID,
    onUpdate: (data: UserInfo) => void
): Unsubscribe | string {
    try {
        const userRef = database().ref("users/" + userID);
        const onChange = userRef.on("value", (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const key = snapshot.key;
                if (!key) throw Error("No userID key");
                onUpdate(convertUserInfo(key, data));
            }
        });
        const unsub = () => userRef.off("value", onChange);
        return unsub;
    } catch (e: any) {
        return `Error ${e.message}`;
    }
}

export async function getUsersOnce(users: UserID[]): Promise<UserInfo[] | string> {
    try {
        const info = [];
        for (const user of users) {
            const res = await getUserOnce(user);
            if (res.type !== MessageType.success) throw Error(res.message);
            info.push(res.data);
        }
        return info;
    } catch (e: any) {
        return e.message;
    }
}

/**
 * Gets a user's info only once
 *
 * @param userID (UserID): The user to get the info of
 * @returns (SuccessMessage<UserInfo> | ErrorMessage | InfoMessage) Informs there is no data, or returns it if there is.
 */
export async function getUserOnce(userID: UserID | null): Promise<Message<UserInfo>> {
    try {
        if (!userID) throw Error("No user ID.");
        const userRef = database().ref("users/" + userID);
        const snapshot = await userRef.once("value");
        if (snapshot.exists()) return { data: snapshot.val(), type: MessageType.success };
        return { message: "User does not have information stored.", type: MessageType.info };
    } catch (e: any) {
        return { message: `Error: ${e.message}`, type: MessageType.error };
    }
}

export async function checkUserInfo(
    userID: UserID | undefined
): Promise<[UserID, UserInfo | undefined] | string> {
    try {
        let id = userID ? userID : auth().currentUser?.uid;
        if (!id) throw Error("No User ID");

        const userRef = database().ref("users/" + id);
        const snapshot = await userRef.once("value");
        if (snapshot.exists()) return [id, snapshot.val()];
        else return [id, undefined];
    } catch (e: any) {
        return `Error: ${e.message}`;
    }
}

/**
 * Delete a user's account info in the db.
 *
 * @param user (User): The user who's info to delete.
 * @returns (SuccessMessage | ErrorMessage)
 */
export async function deleteAccount(userID: UserID): Promise<SuccessMessage | ErrorMessage> {
    try {
        const userRef = database().ref("users/" + userID);
        await userRef.remove();
        await auth().signOut();
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
    pronouns: string;
    phone?: string | null;
    userInfo?: UserInfo | null;
    userID?: string | null;
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
    pronouns,
    gradString,
    userID = null,
    phone = null,
    userInfo = null,
}: ValidateProfileParams): UserInfo | string {
    try {
        const noUserError = "Must supply either phone or previous user info.";
        if (!(phone || userInfo)) throw new Error(noUserError);

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
                userID: userInfo.userID,
                username: username,
                major: major,
                pronouns: pronouns,
                gradYear: gradYear,
                phone: userInfo.phone,
                chillIndex: userInfo.chillIndex,
                ridesCompleted: userInfo.ridesCompleted,
                posts: userInfo.posts ? userInfo.posts : [],
                pending: userInfo.pending ? userInfo.pending : [],
                matches: userInfo.matches ? userInfo.matches : [],
            };
        else if (phone && userID) {
            // Inital Profile Setup
            return {
                userID,
                chillIndex: undefined,
                username: username,
                major: major,
                pronouns: pronouns,
                gradYear: gradYear,
                phone: phone,
                ridesCompleted: 0,
                posts: [],
                pending: [],
                matches: [],
            };
        } else return noUserError;
    } catch (e: any) {
        return `Error: ${e.message}`;
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
