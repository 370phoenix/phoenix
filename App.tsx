/* eslint-disable prettier/prettier */
import "expo-dev-client";

import { useInterpret, useSelector } from "@xstate/react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { AuthContext, authMachine, stateSelector } from "./utils/machines/authMachine";

export default function App() {
    const isLoadingComplete = useCachedResources();
    const authService = useInterpret(authMachine);

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
