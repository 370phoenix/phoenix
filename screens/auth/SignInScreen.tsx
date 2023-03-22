import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Left } from "../../assets/icons/Chevron";
import { View, Text, Button, ValidationState, TextField } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { RootStackParamList } from "../../types";
import { useMachine } from "@xstate/react";
import { signInMachine } from "../../utils/machines/signInMachine";

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">;

export default function SignInScreen({ navigation }: Props) {
    const [phone, setPhone] = React.useState("");
    const [otp, setOtp] = React.useState("");

    const [state, send] = useMachine(signInMachine);
    const { error, confirm } = state.context;

    // Reset flow if user goes back
    const onGoBack = () => {
        setPhone("");
        send("CLOSE");
        navigation.goBack();
    };

    const loading = state.matches("Get Confirm") || state.matches("Submit Verification");

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
                <Text style={styles.title} textStyle="header" styleSize="l">
                    {confirm === null ? "Enter Phone Number" : "Enter verification code"}
                </Text>

                {error ? <Text style={[styles.message]}>{error}</Text> : ""}

                {loading ? (
                    <Text textStyle="header" styleSize="m" style={styles.loading}>
                        Loading...
                    </Text>
                ) : (
                    ""
                )}

                {confirm === null ? (
                    <TextField
                        autoFocus
                        autoComplete="tel"
                        textContentType={Platform.OS === "ios" ? "telephoneNumber" : undefined}
                        keyboardType="phone-pad"
                        clearTextOnFocus
                        validationState={ValidationState.default}
                        inputState={[phone, setPhone]}
                        label="phone number (US only)"
                        style={styles.inputs}
                        light
                    />
                ) : (
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
                )}

                <Button
                    disabled={loading}
                    style={styles.button}
                    title={confirm ? "Submit" : "Next"}
                    color="purple"
                    light
                    onPress={
                        state.context.confirm
                            ? () => send("CHECK OTP", { otp: otp })
                            : () => send("CHECK PHONE", { phone: phone })
                    }
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
    loading: {
        paddingBottom: 20,
        color: Colors.gray.w,
    },
});
