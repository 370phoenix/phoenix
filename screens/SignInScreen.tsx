import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { StatusBar } from "expo-status-bar";
import { getApp } from "firebase/app";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput } from "react-native";
import { View, Text, Button } from "../components/Themed";
import Colors from "../constants/Colors";
import { getVerificationId, Message, signIn } from "../firebase/auth";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">;

export default function CreateScreen({ navigation }: Props) {
    const [phone, setPhone] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [vId, setVId] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<Message | null>(null);
    const captchaRef = React.useRef<FirebaseRecaptchaVerifierModal>(null);

    const app = getApp();

    // Reset flow if user goes back
    const onGoBack = () => {
        setPhone("");
        setVId(null);
        setMessage(null);
        navigation.goBack();
    };

    const onNext = async () => {
        const res = await getVerificationId({
            phoneNumber: phone,
            captchaRef: captchaRef,
        });

        if (res.type === "result" && res.data) {
            setVId(res.data);
        }

        setMessage(res);
    };

    const onSubmit = async () => {
        if (vId && otp) {
            const res = await signIn({ verificationId: vId, verificationCode: otp });
            setMessage(res);
        } else {
            setMessage({
                message: "Error: missing code",
                type: "error",
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.purple.p} style="light" translucent={true} />
            <View style={styles.header}>
                <Button
                    title="Go back"
                    onPress={onGoBack}
                    color="navy"
                    light
                    clear
                    icon={require("../assets/images/chevron.png")}
                />
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.form}>
                <FirebaseRecaptchaVerifierModal
                    ref={captchaRef}
                    firebaseConfig={app ? app.options : undefined}
                    attemptInvisibleVerification={true}
                />
                <Text style={styles.title} textStyle="header" styleSize="l">
                    Enter Phone Number
                </Text>

                {message && (
                    <Text
                        style={[
                            styles.message,
                            { color: message.type === "error" ? "red" : "blue" },
                        ]}>
                        {message.message}
                    </Text>
                )}

                <View style={styles.labeledInput}>
                    <TextInput
                        editable={vId === null}
                        autoFocus
                        autoComplete="tel"
                        textContentType="telephoneNumber"
                        clearTextOnFocus
                        keyboardType="phone-pad"
                        onChangeText={setPhone}
                        value={phone}
                        style={styles.input}
                    />
                    <Text textStyle="label" styleSize="s" style={styles.label}>
                        phone number
                    </Text>
                </View>

                {vId !== null && (
                    <View style={styles.labeledInput}>
                        <TextInput
                            autoFocus
                            autoComplete="sms-otp"
                            textContentType="oneTimeCode"
                            clearTextOnFocus
                            onChangeText={setOtp}
                            value={otp}
                            style={styles.input}
                        />
                        <Text style={styles.label}>Enter verification code</Text>
                    </View>
                )}

                <Button
                    style={styles.button}
                    title={vId ? "Submit" : "Next"}
                    color="purple"
                    light
                    onPress={vId ? onSubmit : onNext}
                />
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
        backgroundColor: Colors.purple.m,
        textColor: "white",
    },
    header: {
        alignItems: "flex-start",
        height: "auto",
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: Platform.OS == "ios" ? Constants.statusBarHeight : 0,
        paddingBottom: 8,
        backgroundColor: Colors.purple.p,
    },
    form: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
    },
    title: {
        color: Colors.gray.w,
        marginBottom: 80,
    },
    labeledInput: {
        width: "100%",
        alignItems: "flex-start",
    },
    label: { fontSize: 14, paddingVertical: 10, color: Colors.gray.w },
    input: {
        fontSize: 18,
        padding: 10,
        width: "100%",
        borderBottomWidth: 1,
        borderColor: Colors.gray.w,
        color: Colors.gray.w,
    },
    button: {
        width: "100%",
        marginVertical: 20,
    },
    message: {
        paddingVertical: 10,
    },
});
