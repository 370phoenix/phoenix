import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Dimensions, Platform, Pressable, StyleSheet } from "react-native";
import CreateButton from "../assets/icons/CreateButton";
import { View, Text } from "../components/Themed";
import Colors from "../constants/Colors";

export default function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
    const [profileColor, setProfileColor] = useState(Colors.navy["2"]);
    const [feedColor, setFeedColor] = useState(Colors.navy["1"]);
    const [profileText, setProfileText] = useState(Colors.navy["p"]);
    const [feedText, setFeedText] = useState(Colors.gray["w"]);

    const onFeed = () => {
        const isFocused = state.key === "ViewPosts";
        const event = navigation.emit({
            type: "tabPress",
            target: "ViewPosts",
            canPreventDefault: true,
        });

        if (!isFocused) navigation.navigate("ViewPosts");
    };
    const onProfile = () => {
        const isFocused = state.key === "Profile";
        const event = navigation.emit({
            type: "tabPress",
            target: "Profile",
            canPreventDefault: true,
        });

        if (!isFocused) navigation.navigate("Profile");
    };
    const longPress = (from: string) => {
        navigation.emit({
            type: "tabLongPress",
            target: from,
        });
    };

    const screenWidth = Dimensions.get("window").width;
    const createLayout = {
        position: "absolute",
        bottom: 10,
        left: screenWidth / 2 - 40,
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.tabButton, { backgroundColor: feedColor }]}
                onPress={onFeed}
                onLongPress={() => longPress("Feed")}>
                <Text textStyle="lineTitle" styleSize="l" style={{ color: feedText }}>
                    FEED
                </Text>
            </Pressable>
            <Pressable
                style={[styles.tabButton, { backgroundColor: profileColor }]}
                onPress={onProfile}
                onLongPress={() => longPress("Profile")}>
                <Text textStyle="lineTitle" styleSize="l" style={{ color: profileText }}>
                    PROFILE
                </Text>
            </Pressable>
            <Pressable
                style={[styles.button, createLayout]}
                onPress={() => navigation.navigate("Modal")}>
                <CreateButton />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: Colors.gray["5"],
        paddingTop: 8,
    },
    tabButton: {
        flex: 1,
        height: 67,
        alignItems: "center",
        justifyContent: "center",
    },
    feed: { flex: 1 },
    profile: { flex: 1 },
    button: {},
});
