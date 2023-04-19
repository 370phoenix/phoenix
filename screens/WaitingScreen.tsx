import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { RootStackParamList } from "../types";

import { Text } from "../components/shared/Themed";
import Colors from "../constants/Colors";

type Props = NativeStackScreenProps<RootStackParamList, "Waiting">;
export default function WaitingScreen({}: Props) {
    return (
        <View style={styles.container}>
            <Text textStyle="header" style={styles.header}>
                Loading...
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: -20,
        backgroundColor: Colors.purple.m,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        color: Colors.gray.w,
        marginBottom: 32,
    },
});
