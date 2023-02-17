import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { StatusBar } from "expo-status-bar";
import { getApp } from "firebase/app";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Left } from "../assets/icons/Chevron";
import { View, Text, Button, ValidationState, TextField } from "../components/Themed";
import Colors from "../constants/Colors";
import { getVerificationId, MessageType, signIn } from "../firebase/auth";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">;

export default function CreateScreen({ navigation }: Props) {
    const [phone, setPhone] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [vId, setVId] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
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

        if (res.type === MessageType.success && res.data) {
            setVId(res.data);
        }
        if (res.message) setMessage(res.message);
    };

    const onSubmit = async () => {
        if (vId && otp) {
            const res = await signIn({ verificationId: vId, verificationCode: otp });
            setMessage(res.message);
        } else {
            setMessage("Error: missing code");
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
                    leftIcon={Left}
                />
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.form}>
                <FirebaseRecaptchaVerifierModal
                    ref={captchaRef}
                    firebaseConfig={app ? app.options : undefined}
                    attemptInvisibleVerification={Platform.OS === "ios" ? true : false}
                />
                <Text style={styles.title} textStyle="header" styleSize="l">
                    Enter Phone Number
                </Text>

                {message ? <Text style={[styles.message]}>{message}</Text> : ""}

                <TextField
                    editable={vId === null}
                    autoFocus
                    autoComplete="tel"
                    textContentType={Platform.OS === "ios" ? "telephoneNumber" : undefined}
                    keyboardType="phone-pad"
                    clearTextOnFocus
                    validationState={ValidationState.default}
                    inputState={[phone, setPhone]}
                    label="phone number (US)"
                    style={styles.inputs}
                    light
                />

                {vId !== null ? (
                    <TextField
                        autoFocus
                        autoComplete="sms-otp"
                        textContentType="oneTimeCode"
                        clearTextOnFocus
                        inputState={[otp, setOtp]}
                        validationState={ValidationState.default}
                        label="verification code"
                        style={styles.inputs}
                        light
                    />
                ) : (
                    ""
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
    inputs: {
        width: "100%",
    },
    button: {
        width: "100%",
        marginVertical: 20,
    },
    message: {
        paddingVertical: 10,
        color: Colors.gray.w,
        textAlign: "center",
        paddingBottom: 16,
    },
});
