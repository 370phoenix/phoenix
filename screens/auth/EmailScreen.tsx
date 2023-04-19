import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, ScrollView } from "react-native";
import Colors from "../../constants/Colors";
import { RootStackParamList } from "../../types";
import { Button, Text, TextField } from "../../components/shared/Themed";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, userSelector } from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";
import { z } from "zod";
import { ErrorBox } from "../../utils/errorHandling";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Email">;
export default function EmailScreen({}: Props) {
    const authService = useContext(AuthContext);
    const user = useSelector(authService, userSelector);
    const emailError = useSelector(authService, (state) => state.context.emailError);

    if (!user) throw Error("SHOULDN'T BE HERE: SIGNED IN WITH NO USER");

    return (
        <View style={styles.container}>
            {user.email ? <Waiting user={user} /> : <EmailForm emailError={emailError} />}
        </View>
    );
}

interface FormProps {
    emailError: Error | z.ZodError | null;
}
function EmailForm({ emailError }: FormProps) {
    const authService = useContext(AuthContext);
    const emailState = useState("");
    const canSetEmail = useSelector(authService, (state) =>
        state.can({ type: "SET EMAIL", email: "" })
    );

    const handleSubmit = () => {
        if (canSetEmail) authService.send({ type: "SET EMAIL", email: emailState[0] });
    };
    return (
        <ScrollView contentContainerStyle={styles.form}>
            <Text style={[styles.text, styles.header]} textStyle="header" styleSize="m">
                We need to verify you!
            </Text>

            <Text style={styles.text} textStyle="body" styleSize="m">
                FareShare is currently only available at Emory University. Please provide an email
                ending in @emory.edu for verification.
            </Text>

            {emailError &&
                (emailError instanceof z.ZodError ? (
                    emailError.issues.map((err, i) => <ErrorBox message={err.message} key={i} />)
                ) : (
                    <ErrorBox message={emailError.message} />
                ))}

            <TextField
                style={styles.input}
                light
                label={"email"}
                inputState={emailState}
                inputMode="email"
                autoComplete="email"
                keyboardType="email-address"
            />

            <Button style={styles.button} color="purple" title="submit" onPress={handleSubmit} />

            <View style={{ height: 200 }} />
        </ScrollView>
    );
}

interface WaitingProps {
    user: FirebaseAuthTypes.User;
}
function Waiting({ user }: WaitingProps) {
    const [timer, setTimer] = useState(0);
    const timerRef = useRef<NodeJS.Timer | null>(null);

    const retry = async () => {
        if (timer > 0) return;

        try {
            await user.sendEmailVerification();
            setTimer(300);
            const x = setInterval(() => {
                setTimer((t) => t - 1);
            }, 1000);
            timerRef.current = x;
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (timerRef.current) {
            if (timer <= 0) {
                clearInterval(timerRef.current);
            }
        }
    }, [timerRef]);

    return (
        <View style={styles.form}>
            <Text style={[styles.text, styles.header]} textStyle="header" styleSize="m">
                Please check your email and click the link we sent!
            </Text>
            <Button onPress={retry} title="Retry?" disabled={timer > 0} color="purple" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.purple.m,
        marginTop: -20,
        paddingTop: 20,
        alignItems: "center",
    },
    form: {
        height: "100%",
        width: 300,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: Colors.gray.w,
        textAlign: "center",
    },
    header: {
        marginBottom: 20,
    },
    button: {
        width: "100%",
    },
    input: {
        marginVertical: 20,
        width: "100%",
    },
});
