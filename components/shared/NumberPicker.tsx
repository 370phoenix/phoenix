import { View, StyleSheet, TouchableOpacity } from "react-native";

import { Text } from "./Themed";
import Colors from "../../constants/Colors";

// Component for number pickers
export default function NumberPicker({
    count,
    handlePlus,
    handleMinus,
}: {
    count: number;
    handlePlus: any;
    handleMinus: any;
}) {
    return (
        <View style={styles.numberPicker}>
            <TouchableOpacity onPress={handleMinus} style={styles.button}>
                <Text textStyle="lineTitle">-</Text>
            </TouchableOpacity>
            <View style={styles.label}>
                <Text textStyle="body" styleSize="m">
                    {count}
                </Text>
            </View>
            <TouchableOpacity onPress={handlePlus} style={styles.button}>
                <Text textStyle="lineTitle">+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    numberPicker: {
        borderRadius: 48,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 120,
    },
    button: {
        height: 40,
        flex: 1,
        backgroundColor: Colors.navy[3],
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        height: 40,
        width: 40,
        backgroundColor: Colors.navy[3],
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 4,
    },
});
