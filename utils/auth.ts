import {
    ApplicationVerifier,
    PhoneAuthProvider,
    signInWithCredential,
    User,
    deleteUser,
} from "firebase/auth/react-native";

import { createContext } from "react";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { get, getDatabase, onValue, ref, remove, set, Unsubscribe } from "firebase/database";
import Filter from "bad-words";
import Genders from "../constants/Genders.json";
import { auth, fire } from "../firebaseConfig";
import { PostID, UserID } from "../constants/DataTypes";

const db = getDatabase(fire);
auth.useDeviceLanguage();

export type AuthState = {
    signedIn: boolean;
    needsInfo: boolean;
    user: User | null;
};

export type AuthAction =
    | {
          type: "SIGN_IN";
          user: User;
      }
    | {
          type: "SIGN_OUT";
      }
    | { type: "COLLECTED" }
    | {
          type: "COLLECT_INFO";
          user: User;
      };

export function authReducer(prevState: AuthState, action: AuthAction) {
    switch (action.type) {
        case "SIGN_IN":
            return {
                needsInfo: prevState.needsInfo,
                signedIn: true,
                user: action.user,
            };
        case "SIGN_OUT":
            return {
                needsInfo: prevState.needsInfo,
                signedIn: false,
                user: null,
            };
        case "COLLECT_INFO":
            return {
                needsInfo: true,
                signedIn: true,
                user: action.user,
            };
        case "COLLECTED":
            return {
                needsInfo: false,
                signedIn: true,
                user: prevState.user,
            };
    }
}

export const AuthContext = createContext<AuthState>({
    signedIn: false,
    needsInfo: false,
    user: null,
});

type GetVerificationParams = {
    phoneNumber: string;
    captchaRef: React.RefObject<FirebaseRecaptchaVerifierModal>;
};

export enum MessageType {
    error,
    info,
    success,
}

// Data type used for returning responses to the UI layer
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

export async function getVerificationId({
    phoneNumber,
    captchaRef,
}: GetVerificationParams): Promise<SuccessMessage<string> | ErrorMessage> {
    try {
        const fullNumber = "+1" + phoneNumber.replace(/\D/g, "");

        if (fullNumber.length !== 12 || fullNumber.match(/\+\d*/g) === null)
            throw new Error("Phone number incorrect format");

        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
            fullNumber,
            captchaRef.current as ApplicationVerifier
        );
        return { data: verificationId, type: MessageType.success };
    } catch (e: any) {
        return { message: `Error verifying phone number: ${e.message}`, type: MessageType.error };
    }
}

type SignInParams = {
    verificationId: string;
    verificationCode: string;
};

export async function signIn({
    verificationId,
    verificationCode,
}: SignInParams): Promise<InfoMessage | ErrorMessage> {
    try {
        const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
        await signInWithCredential(auth, credential);
        return { message: "Phone verification successful", type: MessageType.info };
    } catch (e: any) {
        return { message: `Error: ${e.message}`, type: MessageType.error };
    }
}

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

interface WriteUserParams {
    userId: string;
    userInfo: UserInfo;
}

type Clean<T> = {
    [K in keyof T]?: any;
};

function cleanUndefined<T extends object>(obj: T): T {
    let clean: Clean<T> = {};
    for (const k in obj) {
        if (obj[k]) clean[k] = obj[k];
    }
    return clean as T;
}

export async function writeUser({
    userId,
    userInfo,
}: WriteUserParams): Promise<SuccessMessage | ErrorMessage> {
    try {
        await set(ref(db, "users/" + userId), cleanUndefined(userInfo));
        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: MessageType.error };
    }
}

export function getUserUpdates(
    user: User,
    onUpdate: (data: UserInfo) => void
): SuccessMessage<Unsubscribe> | ErrorMessage {
    try {
        const userRef = ref(db, "users/" + user.uid);
        const unsub = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                onUpdate(data);
            }
        });
        return { message: "Listener attached.", type: MessageType.success, data: unsub };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: MessageType.error };
    }
}

export async function getUserOnce(userID: UserID): Promise<Message<UserInfo>> {
    try {
        const userRef = ref(db, "users/" + userID);
        const snapshot = await get(userRef);
        if (snapshot.exists()) return { data: snapshot.val(), type: MessageType.success };
        return { message: "User does not have information stored.", type: MessageType.info };
    } catch (e: any) {
        return { message: `Error: ${e.message}`, type: MessageType.error };
    }
}

export async function deleteAccount(user: User): Promise<SuccessMessage | ErrorMessage> {
    try {
        await remove(ref(db, "users/" + user.uid));
        return { type: MessageType.success, data: undefined };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: MessageType.error };
    }
}

type ValidateProfileParams = {
    username: string;
    major: string;
    gradString: string;
    gender: string;
    phone?: string | null;
    userInfo?: UserInfo | null;
};
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
