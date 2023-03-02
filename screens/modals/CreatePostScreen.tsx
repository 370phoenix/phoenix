import React from "react";
import { StyleSheet, View } from "react-native";

import CreatePostForm from "../../components/posts/CreatePostForm";
import Colors from "../../constants/Colors";

export default function CreatePostScreen() {
    return (
        <View style={styles.container}>
            <CreatePostForm />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.gray[4],
    },
});
