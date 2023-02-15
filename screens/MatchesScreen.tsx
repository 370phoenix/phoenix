import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";

export default function MatchesScreen() {
    return (
        <View style={styles.container}>
            <Text>Matches</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.purple.m,
        marginTop: -20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});