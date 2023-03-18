import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { View, Button, Text, Spacer, TextField } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { RootStackParamList } from "../../types";
import { useHeaderHeight } from "@react-navigation/elements";
import auth from "@react-native-firebase/auth";
import { useMachine } from "@xstate/react";
import { createProfileMachine } from "../../utils/machines/createProfileMachine";

type NativeProps = NativeStackScreenProps<RootStackParamList, "CreateProfile">;
type Props = NativeProps;
export default function CreateProfileScreen(props: Props) {
    const headerHeight = useHeaderHeight();
    const user = auth().currentUser;
    const [name, setName] = useState("");
    const [major, setMajor] = useState("");
    const [grad, setGrad] = useState("");
    const [gender, setGender] = useState("");

    const [state, send] = useMachine(createProfileMachine);
    const { error } = state.context;

    if (state.matches("Start")) send({ type: "ADVANCE", prevInfo: null });

    useEffect(() => {
        if (!user) return;
        send({
            type: "UPDATE INFO",
            userID: user.uid,
            info: {
                username: name.trim(),
                major: major.trim(),
                gradString: grad.trim(),
                gender: gender.trim(),
                phone: user.phoneNumber,
            },
        });
    }, [name, major, grad, gender, user, send]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                style={styles.body}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={headerHeight}>
                <Spacer direction="column" size={96} />
                <Text textStyle="header" styleSize="l" style={styles.headline}>
                    Thank you for joining FareShare!
                </Text>
                <Spacer direction="column" size={96} />
                <Text
                    textStyle="header"
                    styleSize="s"
                    style={{ color: Colors.gray.w, marginBottom: 32 }}>
                    Please complete your profile.
                </Text>
                {error && (
                    <Text textStyle="label" styleSize="m" style={{ color: Colors.red.p }}>
                        {error}
                    </Text>
                )}
                <TextField
                    label="name"
                    inputState={[name, setName]}
                    keyboardType="default"
                    style={styles.inputs}
                    light
                />
                <TextField
                    label="major"
                    inputState={[major, setMajor]}
                    keyboardType="default"
                    style={styles.inputs}
                    light
                />
                <View style={styles.group}>
                    <TextField
                        label="grad year"
                        inputState={[grad, setGrad]}
                        keyboardType="number-pad"
                        style={styles.smallInputs}
                        light
                    />
                    <Spacer direction="row" size={16} />
                    <TextField
                        label="gender"
                        inputState={[gender, setGender]}
                        keyboardType="default"
                        style={styles.smallInputs}
                        light
                    />
                </View>
                <Spacer direction="column" size={32} />
                <Button
                    title="continue"
                    onPress={() => send("SUBMIT")}
                    color="purple"
                    style={styles.submit}
                    light
                />
                <View style={{ flex: 1 }} />
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: -20,
        backgroundColor: Colors.purple.m,
    },
    body: {
        flex: 1,
        marginTop: 20,
        alignItems: "center",
        paddingHorizontal: 40,
        justifyContent: "flex-end",
    },
    inputs: {
        width: "100%",
        marginBottom: 8,
    },
    smallInputs: {
        flex: 1,
    },
    headline: {
        textAlign: "center",
        color: Colors.gray.w,
    },
    group: { flexDirection: "row" },
    submit: {
        width: "100%",
    },
});
