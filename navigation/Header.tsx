import { StatusBar } from "react-native";
import { Platform, StyleSheet, View } from "react-native";
import LogoHorizontal from "../assets/icons/LogoHorizontal";
import { Button } from "../components/Themed";
import Colors from "../constants/Colors";

type HeaderOnly = {
    title: string;
    leftButton?: boolean;
    rightButton?: boolean;
};
export type HeaderProps = View["props"] & HeaderOnly;

export default function Header({
    style,
    title,
    leftButton = false,
    rightButton = false,
}: HeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <View style={styles.leftBtn}>
                    {leftButton && (
                        <Button clear title="back" light color="navy" onPress={() => {}} short />
                    )}
                </View>
                <LogoHorizontal color={Colors.gray.w} />
                <View style={styles.rightBtn}>
                    {rightButton && (
                        <Button clear title="back" light color="navy" onPress={() => {}} short />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.purple.p,
        width: "100%",
        paddingTop: Platform.OS == "ios" ? 44 : StatusBar.currentHeight,
        height:
            Platform.OS == "ios"
                ? 120
                : 120 - 44 + (StatusBar.currentHeight ? StatusBar.currentHeight : 0),
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
        borderBottomWidth: 8,
        borderColor: Colors.purple["3"],
    },
    body: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: 16,
    },
    leftBtn: {
        flex: 1,
        alignItems: "flex-start",
        paddingHorizontal: 16,
    },
    rightBtn: {
        flex: 1,
        alignItems: "flex-end",
        paddingHorizontal: 16,
    },
});
