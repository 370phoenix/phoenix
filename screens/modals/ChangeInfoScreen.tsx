import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Platform,
    Pressable,
    StyleSheet,
} from "react-native";
import { RootStackParamList } from "../../types";
import { Button, Spacer, Text, TextField, View } from "../../components/shared/Themed";
import { deleteAccount, MessageType } from "../../utils/auth";
import Colors from "../../constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import { useContext, useEffect, useState } from "react";
import { AuthContext, userIDSelector } from "../../utils/machines/authMachine";
import { useMachine, useSelector } from "@xstate/react";
import { createProfileMachine } from "../../utils/machines/createProfileMachine";
import Dropdown from "../../components/shared/Dropdown";
import Pronouns from "../../constants/Pronouns.json";

type Props = NativeStackScreenProps<RootStackParamList, "ChangeInfo">;
export default function ChangeInfoScreen({ route, navigation }: Props) {
    const headerheight = useHeaderHeight();

    const authService = useContext(AuthContext);
    const userID = useSelector(authService, userIDSelector);
    const { userInfo } = route.params ? route.params : { userInfo: null };

    const [state, send] = useMachine(createProfileMachine);

    if (state.matches("Start")) send({ type: "ADVANCE", prevInfo: userInfo });

    const [name, setName] = useState(userInfo ? userInfo.username : "");
    const [major, setMajor] = useState(userInfo ? userInfo.major : "");
    const [grad, setGrad] = useState(userInfo ? String(userInfo.gradYear) : "");
    const [pronouns, setPronouns] = useState(
        Pronouns[
            userInfo
                ? Pronouns.indexOf(userInfo.pronouns) != -1
                    ? Pronouns.indexOf(userInfo.pronouns)
                    : 0
                : 0
        ]
    );

    const [message, setMessage] = useState<string | null>(null);

    const allowChange = state.matches("Information Valid") && state.context.infoChanged;

    useEffect(() => {
        if (!userID || !userInfo) return;
        send("UPDATE INFO", {
            userID: userID,
            info: {
                username: name.trim(),
                major: major.trim(),
                gradString: grad.trim(),
                phone: null,
                pronouns,
            },
        });
    }, [name, major, grad, userID, send, pronouns]);

    const onConfirm = async () => {
        Alert.alert("Confirm Action", "Are you sure you want to make these changes?", [
            {
                text: "Cancel",
                onPress: () => {},
            },
            {
                text: "Confirm",
                onPress: () => {
                    send("SUBMIT");
                    navigation.goBack();
                },
            },
        ]);
    };

    const onDelete = async () => {
        if (!userID) {
            setMessage("Error: no user found.");
            return;
        }
        const res = await deleteAccount(userID);
        if (res.type === MessageType.error) setMessage(res.message);
    };

    return (
        <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView
                style={styles.body}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={headerheight}>
                <Text textStyle="header" styleSize="m" style={{ marginBottom: 32 }}>
                    Tap to Change Information
                </Text>

                <TextField style={styles.input} label={"name"} inputState={[name, setName]} />
                <TextField style={styles.input} label={"major"} inputState={[major, setMajor]} />
                <TextField style={styles.input} label={"grad year"} inputState={[grad, setGrad]} />
                <Dropdown
                    label="pronouns"
                    onChange={(newOne) => {
                        setPronouns(newOne);
                    }}
                    firstSelected={userInfo ? Pronouns.indexOf(userInfo.pronouns) : 0}
                    options={Pronouns}
                    style={styles.input}
                />

                {message && (
                    <Text textStyle="label" styleSize="m" style={styles.message}>
                        {message}
                    </Text>
                )}

                <Spacer direction="column" size={50} />

                <Button
                    disabled={!allowChange}
                    onPress={() => onConfirm()}
                    title="Confirm?"
                    color="navy"
                    style={styles.button}
                />
                <Button
                    onPress={() => onDelete()}
                    title="DELETE ACCOUNT"
                    color="red"
                    style={styles.button}
                />
                <Button
                    onPress={() => Linking.openURL("https://forms.gle/DfQnUnXuQNcGR3ec7")}
                    title="Bug Report/Feedback"
                    color="purple"
                    style={[styles.button, styles.feedback]}
                />

                <View style={{ flex: 1 }} />
            </KeyboardAvoidingView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: Colors.gray["4"],
    },
    body: {
        height: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingTop: 32,
        paddingHorizontal: 16,
    },
    input: {
        marginBottom: 16,
        width: "80%",
    },
    button: {
        width: "80%",
        marginBottom: 16,
    },
    message: {
        color: Colors.red.p,
    },
    feedback: {
        marginTop: 30,
    },
});
