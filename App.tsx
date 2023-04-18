/* eslint-disable prettier/prettier */
import "expo-dev-client";

import { firebase } from "@react-native-firebase/app-check";
import { useInterpret } from "@xstate/react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { AuthContext, authMachine } from "./utils/machines/authMachine";
import { useEffect, useRef } from "react";
import { rnfbProvider } from "./utils/appCheck";

export default function App() {
    const isLoadingComplete = useCachedResources();
    const authService = useInterpret(authMachine);
    const initialized = useRef(false);

    // Initialize App Check
    useEffect(() => {
        if (initialized.current === false) {
            firebase.appCheck().initializeAppCheck({
                provider: rnfbProvider,
            });
            initialized.current = true;
        }
    }, [initialized, firebase]);

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <AuthContext.Provider value={authService}>
                <SafeAreaProvider style={{ flex: 1, backgroundColor: "#fff" }}>
                    <Navigation />
                    <StatusBar />
                </SafeAreaProvider>
            </AuthContext.Provider>
        );
    }
}
