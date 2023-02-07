import { Button, FlatList, Pressable, StyleSheet, TextInput } from "react-native";
import { Text, View } from "../components/Themed";

export default function LoginScreen() {
    const onCreateAccount = () => {};

    const onLogin = () => {};

    return (
        <View style={styles.container}>
            <Pressable onPress={onCreateAccount}>
                <Text style={styles.create}>Create Acccount</Text>
            </Pressable>
            <Pressable onPress={onLogin}>
                <Text style={styles.login}>Login</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    create: {},
    login: {},
});
