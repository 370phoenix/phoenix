import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Unsubscribe } from "./posts";
import { getDB } from "./db";

import { UserInfo, UserSchema } from "./userValidation";
import { getFunctions } from "./functions";

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

    const userRef = getDB().ref("users/" + userID);
    await userRef.set(userInfo);
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
export function getUserUpdates(
    userID: string,
    onUpdate: (data: UserInfo | null) => void,
    onError: (error: Error) => void
): Unsubscribe {
    const userRef = getDB().ref("users/" + userID);
    const onChange = userRef.on("value", (snapshot) => {
        if (snapshot.exists()) {
            try {
                const userInfo = UserSchema.parse(snapshot.val());
                onUpdate(userInfo);
            } catch (e: any) {
                onError(e);
            }
        } else {
            onUpdate(null);
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
    const userRef = getDB().ref("users/" + userID);
    const snapshot = await userRef.once("value");
    if (snapshot.exists()) return UserSchema.parse(snapshot.val());
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
    await getFunctions().httpsCallable("deleteUser")();
    await auth().signOut();
}
