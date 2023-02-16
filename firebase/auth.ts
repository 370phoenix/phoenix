import { fire } from "../firebaseConfig";
import {
    ApplicationVerifier,
    initializeAuth,
    getReactNativePersistence,
    PhoneAuthProvider,
    signInWithCredential,
    User,
    deleteUser,
} from "firebase/auth/react-native";

import { createContext } from "react";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get, getDatabase, onValue, ref, remove, set } from "firebase/database";

const auth = initializeAuth(fire, { persistence: getReactNativePersistence(AsyncStorage) });
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

export const AuthContext = createContext<AuthState | null>(null);

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
        await set(ref(db, "users/" + user.uid), userInfo);
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
            const data = snapshot.val();
            onUpdate(data);
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
