import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import CreateButton from "../assets/icons/CreateButton";
import SteeringWheel from "../assets/icons/SteeringWheel";
import { Full } from "../assets/icons/User";
import { View, Text } from "../components/shared/Themed";
import Colors from "../constants/Colors";

export default function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
    const activeColor = Colors.navy["p"];
    const passiveColor = Colors.navy["1"];
    const activePressedColor = Colors.navy["m"];
    const [createColor, setCreateColor] = useState(Colors.gray.w);

    const screenWidth = Dimensions.get("window").width;
    const createLayout = {
        left: screenWidth / 2 - 40,
    };

    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index == index;
                const label = route.name.toUpperCase();

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                };
                const longPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };

                return (
                    <Pressable
                        style={({ pressed }) => {
                            const localStyle = route.name === "Feed" ? styles.feed : styles.profile;
                            return [
                                styles.tabButton,
                                localStyle,
                                {
                                    backgroundColor: isFocused
                                        ? pressed
                                            ? activePressedColor
                                            : activeColor
                                        : pressed
                                        ? activeColor
                                        : passiveColor,
                                },
                            ];
                        }}
                        onPress={onPress}
                        onLongPress={longPress}
                        key={route.key}>
                        {route.name === "Feed" ? (
                            <SteeringWheel height={30} width={30} color={Colors.gray.w} />
                        ) : (
                            <Full height={28} width={28} color={Colors.gray.w} />
                        )}
                        <Text
                            textStyle="lineTitle"
                            styleSize="l"
                            style={{ color: Colors.gray.w, marginLeft: 8 }}>
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
            <Pressable
                style={[styles.button, createLayout]}
                onPress={() => navigation.navigate("CreatePost")}
                onPressIn={() => setCreateColor(Colors.purple["3"])}
                onPressOut={() => setCreateColor(Colors.gray.w)}>
                <CreateButton color={createColor} />
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
        flexDirection: "row",
    },
    feed: {
        paddingRight: 20,
    },
    profile: {
        paddingLeft: 20,
    },
    button: {
        position: "absolute",
        bottom: 14,
    },
});
