import { FontAwesome } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Dimensions, Platform, Pressable, StyleSheet } from "react-native";
import CreateButton from "../assets/icons/CreateButton";
import { View, Text } from "../components/Themed";
import Colors from "../constants/Colors";

export default function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
    const activeColor = Colors.navy["1"];
    const passiveColor = Colors.navy["2"];
    const activePressedColor = Colors.navy["m"];
    const textActive = Colors.gray.w;
    const textPassive = Colors.navy.p;
    const [createColor, setCreateColor] = useState(Colors.gray.w);

    const screenWidth = Dimensions.get("window").width;
    const createLayout = {
        position: "absolute",
        bottom: 10,
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
                            return [
                                styles.tabButton,
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
                        <FontAwesome
                            color={isFocused ? textActive : textPassive}
                            size={20}
                            name={route.name == "Feed" ? "rss" : "user"}
                        />
                        <Text
                            textStyle="lineTitle"
                            styleSize="l"
                            style={{ color: isFocused ? textActive : textPassive, marginLeft: 8 }}>
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
    button: {},
});
