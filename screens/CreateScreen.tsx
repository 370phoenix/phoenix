import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { getApp } from "firebase/app";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TextInput,
} from "react-native";
import { View, Text, Button } from "../components/Themed";
import { getVerificationId, Message, signIn } from "../firebase/auth";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Create">;

export default function CreateScreen({ navigation }: Props) {
    const [phone, setPhone] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [vId, setVId] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<Message | null>(null);
    const captchaRef = React.useRef<FirebaseRecaptchaVerifierModal>(null);

    const app = getApp();

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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button title="Go back" onPress={onGoBack} color="blue" light />
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.form}>
                <FirebaseRecaptchaVerifierModal
                    ref={captchaRef}
                    firebaseConfig={app ? app.options : undefined}
                    attemptInvisibleVerification={true}
                />
                <Text style={styles.title}>Create Account</Text>

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
                    <Text style={styles.label}>Enter phone number</Text>
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
                </View>

                {vId !== null && (
                    <View style={styles.labeledInput}>
                        <Text style={styles.label}>Enter verification code</Text>
                        <TextInput
                            autoFocus
                            autoComplete="sms-otp"
                            textContentType="oneTimeCode"
                            clearTextOnFocus
                            onChangeText={setOtp}
                            value={otp}
                            style={styles.input}
                        />
                    </View>
                )}

                <Button
                    style={styles.button}
                    title={vId ? "Submit" : "Next"}
                    color="blue"
                    onPress={vId ? onSubmit : onNext}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#fff",
    },
    header: {
        alignItems: "flex-start",
        height: "auto",
        width: "100%",
        paddingHorizontal: 20,
    },
    form: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
    },
    labeledInput: {
        marginBottom: 20,
        width: "100%",
        alignItems: "flex-start",
    },
    label: { fontSize: 14, paddingVertical: 10 },
    input: {
        fontSize: 18,
        padding: 10,
        width: "100%",
        borderWidth: 1,
        borderColor: "black",
    },
    button: {
        width: "100%",
        marginVertical: 20,
    },
    message: {
        paddingVertical: 10,
    },
});
