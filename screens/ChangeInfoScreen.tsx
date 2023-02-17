import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { RootStackParamList } from "../types";
import { Button, Spacer, Text, TextField, View } from "../components/Themed";
import { deleteAccount, MessageType, UserInfo, validateProfile, writeUser } from "../firebase/auth";
import { getAuth } from "firebase/auth/react-native";
import Colors from "../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useState } from "react";
import ModalHeader from "../components/ModalHeader";

type Props = NativeStackScreenProps<RootStackParamList, "ChangeInfo">;
export default function ChangeInfoScreen({ route, navigation }: Props) {
    const headerheight = useHeaderHeight();

    const auth = getAuth();
    const user = auth.currentUser;
    let userInfo: UserInfo | null = null;

    if (route.params) ({ userInfo } = route.params);

    const nameState = useState(userInfo ? userInfo.username : "");
    const majorState = useState(userInfo ? userInfo.major : "");
    const gradState = useState(userInfo ? String(userInfo.gradYear) : "");
    const genderState = useState(userInfo ? userInfo.gender : "");

    const [message, setMessage] = useState("");

    const onConfirm = async () => {
        if (!user || !userInfo) {
            setMessage("Error getting user id or information.");
            return;
        }

        const valid = validateProfile({
            username: nameState[0].trim(),
            major: majorState[0].trim(),
            gradString: gradState[0].trim(),
            gender: genderState[0].trim(),
            userInfo: userInfo,
        });

        if (valid.type === MessageType.error) {
            setMessage(valid.message);
            return;
        }
        if (!valid.data) return;

        const res = await writeUser({
            user: user,
            userInfo: valid.data,
        });

        if (res.type === MessageType.error) {
            setMessage(res.message);
        } else {
            navigation.goBack();
        }
    };

    const onDelete = async () => {
        if (!user) {
            setMessage("Error: no user found.");
            return;
        }
        const res = await deleteAccount(user);
        if (res.type === MessageType.error) setMessage(res.message);
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.body}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={headerheight}>
                <Text textStyle="header" styleSize="m" style={{ marginBottom: 32 }}>
                    Tap to Change Information
                </Text>

                <TextField style={styles.input} label={"name"} inputState={nameState} />
                <TextField style={styles.input} label={"major"} inputState={majorState} />
                <TextField style={styles.input} label={"grad year"} inputState={gradState} />
                <TextField style={styles.input} label={"gender"} inputState={genderState} />

                {message && (
                    <Text textStyle="label" styleSize="m" style={styles.message}>
                        {message}
                    </Text>
                )}

                <Spacer direction="column" size={50} />

                <Button onPress={onConfirm} title="Confirm?" color="navy" style={styles.button} />
                <Button
                    onPress={onDelete}
                    title="DELETE ACCOUNT"
                    color="red"
                    style={styles.button}
                />

                <View style={{ flex: 1 }} />
            </KeyboardAvoidingView>
        </View>
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
});
