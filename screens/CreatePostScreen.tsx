import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";

import CreatePostForm from "../components/CreatePostForm";
import Colors from "../constants/Colors";

// TODO: Fix text input interaction with keyboard, currently location inputs are blocked by keyboard
export default function CreatePostScreen() {
    const height = useHeaderHeight();
    return <CreatePostForm />;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.gray.w,
        color: Colors.gray[4],
    },
});
