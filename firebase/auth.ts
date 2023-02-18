import {
    ApplicationVerifier,
    PhoneAuthProvider,
    signInWithCredential,
    User,
    deleteUser,
    getAuth,
} from "firebase/auth/react-native";

import { createContext } from "react";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { get, getDatabase, onValue, ref, remove, set } from "firebase/database";
import Filter from "bad-words";
import Genders from "../constants/Genders.json";
import { fire, auth } from "../firebaseConfig";

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
export type SuccessMessage<T = void> = {
    message?: string;
    data?: T;
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
};

interface WriteUserParams {
    user: User;
    userInfo: UserInfo;
}

export async function writeUser({
    user,
    userInfo,
}: WriteUserParams): Promise<SuccessMessage | ErrorMessage> {
    try {
        const db = getDatabase();
        await set(ref(db, "users/" + user.uid), {
            username: userInfo.username,
            major: userInfo.major,
            gender: userInfo.gender,
            gradYear: userInfo.gradYear,
            phone: userInfo.phone ? userInfo.phone : user.phoneNumber,
            chillIndex: userInfo.chillIndex ? userInfo.chillIndex : null,
            ridesCompleted: userInfo.ridesCompleted ? userInfo.ridesCompleted : 0,
        });
        return { type: MessageType.success };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: MessageType.error };
    }
}

export async function getUserUpdates(
    user: User,
    onUpdate: (data: any) => void
): Promise<SuccessMessage | ErrorMessage> {
    try {
        const db = getDatabase();
        const userRef = ref(db, "users/" + user.uid);
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                onUpdate(data);
            }
        });
        return { message: "Listener attached.", type: MessageType.success };
    } catch (e: any) {
        return { message: `Error ${e.message}`, type: MessageType.error };
    }
}

export async function getUserOnce(user: User): Promise<Message<any>> {
    try {
        const db = getDatabase();
        const userRef = ref(db, "users/" + user.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) return { data: snapshot.val(), type: MessageType.success };
        return { message: "User does not have information stored.", type: MessageType.info };
    } catch (e: any) {
        return { message: `Error: ${e.message}`, type: MessageType.error };
    }
}

export async function deleteAccount(user: User): Promise<SuccessMessage | ErrorMessage> {
    try {
        const db = getDatabase();
        await remove(ref(db, "users/" + user.uid));
        await deleteUser(user);
        return { type: MessageType.success };
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
        return { type: MessageType.error, message: "Please make sure grad year is all digits." };

    const gradYear = Number(gradString);
    if (userInfo)
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
            },
        };
    else if (phone) {
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
            },
        };
    } else return noUserError;
}
