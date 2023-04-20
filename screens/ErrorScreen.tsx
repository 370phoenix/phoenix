import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "@xstate/react";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackParamList } from "../types";
import { AuthContext } from "../utils/machines/authMachine";

import { Text } from "../components/shared/Themed";
import { z } from "zod";
import Colors from "../constants/Colors";

type Props = NativeStackScreenProps<RootStackParamList, "Error">;
export default function ErrorScreen({}: Props) {
    const authService = useContext(AuthContext);
    const error = useSelector(authService, (state) => state.context.error);
    let guts;

    if (!error)
        guts = (
            <View style={styles.errorBox}>
                <Text textStyle="body" styleSize="m" style={styles.error}>
                    An error occured! But we don't know what it is...
                </Text>
            </View>
        );
    else if (error instanceof z.ZodError)
        guts = (
            <>
                {error.issues.map((issue, index) => (
                    <View style={styles.errorBox} key={index}>
                        <Text textStyle="body" styleSize="m" style={styles.error}>
                            {issue.path + ":"}
                        </Text>
                        <Text textStyle="body" styleSize="m" style={styles.error}>
                            {issue.message}
                        </Text>
                    </View>
                ))}
            </>
        );
    else
        guts = (
            <View style={styles.errorBox}>
                <Text textStyle="body" styleSize="m" style={styles.error}>
                    {error.message}
                </Text>
            </View>
        );

    return (
        <View style={styles.container}>
            <Text textStyle="header" style={styles.header}>
                An Error Occured
            </Text>
            <Text textStyle="header" styleSize="s" style={styles.header}>
                (auth service)
            </Text>
            {guts}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: -20,
        backgroundColor: Colors.purple.m,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        color: Colors.gray.w,
        marginBottom: 32,
    },
    errorBox: {
        padding: 20,
        backgroundColor: Colors.red.p,
        borderWidth: 4,
        borderRadius: 8,
        borderColor: Colors.red[4],
        marginBottom: 16,
    },
    error: {
        color: Colors.gray.w,
    },
});
