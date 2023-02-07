import { fire } from "../firebaseConfig";
import { createContext } from "react";

export interface AuthState {
    signedIn: boolean;
    username: string | null;
}

export const NOAUTH = {
    signedIn: false,
    username: null,
};

export const AuthContext = createContext(NOAUTH);
