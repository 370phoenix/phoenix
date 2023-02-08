/* eslint-disable prettier/prettier */
import { StatusBar } from "expo-status-bar";
import { getAuth, onAuthStateChanged, User } from "firebase/auth/react-native";
import { Reducer, useContext, useMemo, useReducer } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthAction, AuthContext, authReducer, AuthState, signIn } from "./firebase/auth";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();
    const auth = getAuth();

    const [authState, authDispatch] = useReducer<Reducer<AuthState, AuthAction>>(authReducer, {
        signedIn: false,
        user: null,
    } as AuthState);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            authDispatch({ type: "SIGN_IN", user: user });
        } else {
            authDispatch({ type: "SIGN_OUT" });
        }
    });

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <AuthContext.Provider value={[authState, authDispatch]}>
                <SafeAreaProvider>
                    <Navigation colorScheme={colorScheme} />
                    <StatusBar />
                </SafeAreaProvider>
            </AuthContext.Provider>
        );
    }
}
