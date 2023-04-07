import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import PostList from "../components/posts/PostList";
import { View } from "../components/shared/Themed";
import Colors from "../constants/Colors";

export default function PostFeedScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <PostList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: -20,
        backgroundColor: Colors.purple.m,
    },
});
