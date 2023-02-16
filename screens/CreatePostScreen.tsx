import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { StyleSheet, ScrollView } from "react-native";

import CreatePostForm from "../components/CreatePostForm";
import Colors from "../constants/Colors";


// TODO: Fix text input interaction with keyboard, currently location inputs are blocked by keyboard
export default function CreatePostScreen() {
    // const height = useHeaderHeight();
    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            {/* <KeyboardAvoidingView
                behavior="position"
                style={{ flex: 1 }}
                keyboardVerticalOffset={height}> */}
                <CreatePostForm />
            {/* </KeyboardAvoidingView> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.gray.w,
        color: Colors.gray[4],
    },
});
