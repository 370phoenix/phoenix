import { FlatList, Pressable, StyleSheet, TextInput } from "react-native";
import { Text, View, Button } from "../components/Themed";

export default function LoginScreen() {
    const onCreateAccount = () => {};

    const onLogin = () => {};

    return (
        <View style={styles.container}>
            <Button onPress={onCreateAccount} title="Create Account" light={false} color="green" />
            <Button onPress={onLogin} title="Login" color="green" light />
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
