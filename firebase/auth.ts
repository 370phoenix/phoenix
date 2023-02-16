import { fire } from "../firebaseConfig";
import {
    ApplicationVerifier,
    initializeAuth,
    getReactNativePersistence,
    PhoneAuthProvider,
    signInWithCredential,
    User,
} from "firebase/auth/react-native";

import { createContext } from "react";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import AsyncStorage from "@react-native-async-storage/async-storage";

const auth = initializeAuth(fire, { persistence: getReactNativePersistence(AsyncStorage) });
auth.useDeviceLanguage();

type AuthSignedIn = {
    signedIn: true;
    user: User;
};

type AuthSignedOut = {
    signedIn: false;
    user: null;
};

export type AuthState = AuthSignedIn | AuthSignedOut;

export type AuthAction =
    | {
          type: "SIGN_IN";
          user: User;
      }
    | {
          type: "SIGN_OUT";
      };

export function authReducer(prevState: AuthState | undefined, action: AuthAction) {
    switch (action.type) {
        case "SIGN_IN":
            return {
                signedIn: true,
                user: action.user,
            } as AuthSignedIn;
        case "SIGN_OUT":
            return {
                signedIn: false,
                user: null,
            } as AuthSignedOut;
    }
}

export const AuthContext = createContext<AuthState | null>(null);

type GetVerificationParams = {
    phoneNumber: string;
    captchaRef: React.RefObject<FirebaseRecaptchaVerifierModal>;
};

// Data type used for returning responses to the UI layer
export type Message = {
    message?: string;
    data?: any;
    type: "error" | "info" | "result";
};

export async function getVerificationId({
    phoneNumber,
    captchaRef,
}: GetVerificationParams): Promise<Message> {
    try {
        const fullNumber = "+1" + phoneNumber.replace(/\D/g, "");

        if (fullNumber.length !== 12 || fullNumber.match(/\+\d*/g) === null)
            throw new Error("Phone number incorrect format");

        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
            fullNumber,
            captchaRef.current as ApplicationVerifier
        );
        return { data: verificationId, type: "result" };
    } catch (e: any) {
        return { message: `Error verifying phone number: ${e.message}`, type: "error" };
    }
}

type SignInParams = {
    verificationId: string;
    verificationCode: string;
};

export async function signIn({ verificationId, verificationCode }: SignInParams): Promise<Message> {
    try {
        const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
        await signInWithCredential(auth, credential);
        return { message: "Phone verification successful", type: "info" };
    } catch (e: any) {
        return { message: `Error: ${e.message}`, type: "error" };
    }
}
