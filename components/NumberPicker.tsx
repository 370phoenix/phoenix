import { View, StyleSheet } from "react-native";

import { Button, Text } from "./Themed";
import Colors from "../constants/Colors";

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
            <Button title="+" color="purple" clear onPress={handlePlus} />
            <Text style={styles.item}>{count}</Text>
            <Button title="-" color="purple" clear onPress={handleMinus} />
        </View>
    );
}

const styles = StyleSheet.create({
    numberPicker: {
        backgroundColor: Colors.gray[4],
        borderRadius: 48,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 80,
    },
    item: {
        margin: 8,
    }
});
