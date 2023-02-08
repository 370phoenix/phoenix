/* eslint-disable prettier/prettier */
import { StatusBar } from "expo-status-bar";
import { getAuth, onAuthStateChanged, User } from "firebase/auth/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthAction, AuthContext, authReducer, AuthState, signIn } from "./firebase/auth";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider style={{ flex: 1, backgroundColor: "#fff" }}>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
            </SafeAreaProvider>
        );
    }
}
