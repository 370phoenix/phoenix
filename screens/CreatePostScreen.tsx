import React, { useState } from "react";
import {
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
} from "react-native";
import Colors from "../constants/Colors";
import { RootTabScreenProps } from "../types";
import { useHeaderHeight } from "@react-navigation/elements";
import CreatePostForm from "../components/CreatePostForm";

// TODO: Fix text input interaction with keyboard, currently location inputs are blocked by keyboard
export default function CreatePostScreen({ navigation }: RootTabScreenProps<"CreatePost">) {
    const height = useHeaderHeight();
    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
                behavior={"position"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={height}>
                <CreatePostForm />
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.purple[4],
        color: Colors.gray[4],
    },
});
