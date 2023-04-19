/* eslint-disable prettier/prettier */
import "expo-dev-client";

import { firebase } from "@react-native-firebase/app-check";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { AuthContext, authMachine } from "./utils/machines/authMachine";
import { useEffect, useRef } from "react";
import { rnfbProvider } from "./utils/appCheck";
import { interpret } from "xstate";
import { useSelector } from "@xstate/react";

const authService = interpret(authMachine);
authService.start();

export default function App() {
    const isLoadingComplete = useCachedResources();
    const initialized = useRef(false);
    const state = useSelector(authService, (state) => state);
    console.log(state.value);

    // Initialize App Check
    useEffect(() => {
        if (initialized.current === false) {
            console.log("Initializing App Check");
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
