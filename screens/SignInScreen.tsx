import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { View, Button } from "../components/Themed";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">;

export default function SignInScreen({ navigation }: Props) {
    const onCreateAccount = () => {
        navigation.navigate("Create");
    };

    const onLogin = () => {
        navigation.navigate("Login");
    };

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
