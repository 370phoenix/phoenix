/* eslint-disable prettier/prettier */
import "expo-dev-client";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

export default function App() {
    const isLoadingComplete = useCachedResources();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider style={{ flex: 1, backgroundColor: "#fff" }}>
                <Navigation />
                <StatusBar />
            </SafeAreaProvider>
        );
    }
}
