import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Dispatch, useContext, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { View, Button, Text, Spacer, TextField } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { RootStackParamList } from "../../types";
import { useHeaderHeight } from "@react-navigation/elements";
import { AuthAction, AuthContext, MessageType, validateProfile, writeUser } from "../../utils/auth";

type NativeProps = NativeStackScreenProps<RootStackParamList, "CreateProfile">;
type UniqueProps = {
    authDispatch: Dispatch<AuthAction>;
};
type Props = NativeProps & UniqueProps;
export default function CreateProfileScreen({ authDispatch }: Props) {
    const headerHeight = useHeaderHeight();
    const nameState = useState("");
    const majorState = useState("");
    const gradState = useState("");
    const genderState = useState("");
    const authState = useContext(AuthContext);

    const [message, setMessage] = useState<string | null>(null);

    const onSubmit = async () => {
        const user = authState.user;

        if (user && user.phoneNumber) {
            const valid = validateProfile({
                username: nameState[0].trim(),
                major: majorState[0].trim(),
                gradString: gradState[0].trim(),
                gender: genderState[0].trim(),
                phone: user.phoneNumber,
            });

            if (valid.type === MessageType.error) {
                setMessage(valid.message);
                return;
            }
            if (!valid.data) return;

            const res = await writeUser({ userId: user.uid, userInfo: valid.data });
            if (res.type === MessageType.success) authDispatch({ type: "COLLECTED" });
            else setMessage(res.message);
        }
    };

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
                {message && (
                    <Text textStyle="label" styleSize="m" style={{ color: Colors.red.p }}>
                        {message}
                    </Text>
                )}
                <TextField
                    label="name"
                    inputState={nameState}
                    keyboardType="default"
                    style={styles.inputs}
                    light
                />
                <TextField
                    label="major"
                    inputState={majorState}
                    keyboardType="default"
                    style={styles.inputs}
                    light
                />
                <View style={styles.group}>
                    <TextField
                        label="grad year"
                        inputState={gradState}
                        keyboardType="number-pad"
                        style={styles.smallInputs}
                        light
                    />
                    <Spacer direction="row" size={16} />
                    <TextField
                        label="gender"
                        inputState={genderState}
                        keyboardType="default"
                        style={styles.smallInputs}
                        light
                    />
                </View>
                <Spacer direction="column" size={32} />
                <Button
                    title="continue"
                    onPress={() => onSubmit()}
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
