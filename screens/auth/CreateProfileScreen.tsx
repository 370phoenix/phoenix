import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Pressable, Keyboard } from "react-native";
import { View, Button, Text, Spacer, TextField } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";

import { useMachine, useSelector } from "@xstate/react";
import { createProfileMachine } from "../../utils/machines/createProfileMachine";
import Dropdown from "../../components/shared/Dropdown";
import Pronouns from "../../constants/Pronouns.json";
import { RootStackParamList } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthContext, userSelector } from "../../utils/machines/authMachine";

type Props = NativeStackScreenProps<RootStackParamList, "CreateProfile">;
export default function CreateProfileScreen({ }: Props) {
    const authService = useContext(AuthContext);
    const user = useSelector(authService, userSelector);

    const [name, setName] = useState("");
    const [major, setMajor] = useState("");
    const [grad, setGrad] = useState("");
    const [pronouns, setPronouns] = useState(Pronouns[0]);

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
                phone: user.phoneNumber,
                pronouns,
            },
        });
    }, [name, major, grad, pronouns, user, send]);

    return (
        <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
            <StatusBar style="light" />
            <View style={styles.body}>
                <Spacer direction="column" size={72} />
                <Text textStyle="header" styleSize="l" style={styles.headline}>
                    Thank you for joining FareShare!
                </Text>
                <Spacer direction="column" size={72} />
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
                <TextField
                    label="grad year"
                    inputState={[grad, setGrad]}
                    keyboardType="number-pad"
                    style={styles.inputs}
                    light
                />
                <Spacer direction="row" size={16} />
                <Dropdown
                    light
                    label="pronouns"
                    style={styles.smallInputs}
                    onChange={(newOne) => {
                        setPronouns(newOne);
                    }}
                    options={Pronouns}
                />
                <Button
                    title="continue"
                    onPress={() => send("SUBMIT")}
                    color="purple"
                    style={styles.submit}
                    light
                />
                <View style={{ flex: 1 }} />
            </View>
        </Pressable>
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
        width: "100%",
        paddingBottom: 16,
    },
    headline: {
        textAlign: "center",
        color: Colors.gray.w,
    },
    group: { flexDirection: "row", zIndex: 100 },
    submit: {
        width: "100%",
    },
});
