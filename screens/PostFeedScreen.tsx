import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import PostList from "../components/PostList";
import { View } from "../components/Themed";
import Colors from "../constants/Colors";
import { RootTabScreenProps } from "../types";

export default function PostFeedScreen({ navigation }: RootTabScreenProps<"Feed">) {
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
