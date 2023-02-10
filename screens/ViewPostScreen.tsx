import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import PostList from "../components/PostList";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

export default function TabOneScreen({ navigation }: RootTabScreenProps<"ViewPosts">) {
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
        alignItems: "center",
        justifyContent: "center",
    },
});
