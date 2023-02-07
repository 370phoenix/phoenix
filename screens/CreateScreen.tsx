import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput } from "react-native";
import { View, Text, Button } from "../components/Themed";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Create">;

export default function CreateScreen({ navigation }: Props) {
    const [phone, onChangePhone] = React.useState("Phone number");

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button title="Go back" onPress={() => navigation.goBack()} color="blue" light />
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.form}>
                <Text style={styles.title}>Create Account</Text>
                <View style={styles.labeledInput}>
                    <Text style={styles.label}>Enter phone number</Text>
                    <TextInput
                        autoFocus
                        clearTextOnFocus
                        keyboardType="phone-pad"
                        onChangeText={onChangePhone}
                        value={phone}
                        style={styles.input}
                    />
                    <Button style={styles.button} title="Next" color="blue" onPress={() => null} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    header: {
        height: "auto",
        marginHorizontal: 10,
    },
    form: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
    },
    labeledInput: {
        marginVertical: 20,
        width: "80%",
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
        paddingVertical: 20,
    },
});
