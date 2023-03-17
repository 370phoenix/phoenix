/* eslint-disable prettier/prettier */
import auth from "@react-native-firebase/auth";
import { useInterpret } from "@xstate/react";
import "expo-dev-client";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { AuthContext, authMachine } from "./utils/machines";

export default function App() {
    const isLoadingComplete = useCachedResources();
    const authService = useInterpret(authMachine);

    useEffect(() => {
        const authSubscriber = auth().onAuthStateChanged(async (user) => {
            if (user) {
                authService.send({ type: "INFO CHANGED", obj: user.uid });
            } else {
                authService.send({ type: "Sign Out" });
            }
        });

        // Stop listening to the updates when component unmounts
        return authSubscriber;
    }, []);

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
