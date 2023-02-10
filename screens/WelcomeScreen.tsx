import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image } from "react-native";
import { View, Button, Text } from "../components/Themed";
import Colors from "../constants/Colors";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function SignInScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Image style={styles.logo} source={require("../assets/images/logo-horizontal.png")} />
            <Text textStyle="header" styleSize="s" style={styles.headline}>
                Create account or sign in
            </Text>
            <Button
                style={{ width: "80%" }}
                onPress={() => {
                    navigation.navigate("SignIn");
                }}
                title="Create Account"
                color="purple"
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
        backgroundColor: Colors.purple.m,
    },
    logo: {
        height: 50,
        resizeMode: "contain",
        marginBottom: 80,
    },
    headline: { color: Colors.gray.w, marginBottom: 80 },
});
