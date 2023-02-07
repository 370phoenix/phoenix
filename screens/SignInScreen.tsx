import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { View, Button } from "../components/Themed";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">;

export default function SignInScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Button
                onPress={() => navigation.navigate("Create")}
                title="Create Account"
                color="green"
            />
            <View style={{ marginBottom: 30 }} />
            <Button
                onPress={() => navigation.navigate("Login")}
                title="Login"
                color="green"
                light
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
