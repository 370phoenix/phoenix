import { View, StyleSheet, TouchableOpacity } from "react-native";

import { Spacer, Text } from "./Themed";
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
            <TouchableOpacity onPress={handlePlus}>
            <Text textStyle="label" styleSize="l">+</Text>
            </TouchableOpacity>
            <Spacer direction="row" size={24}/>
            <Text textStyle="label" styleSize="l">{count}</Text>
            <Spacer direction="row" size={24}/>
            <TouchableOpacity onPress={handleMinus}>
            <Text textStyle="label" styleSize="l">-</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    numberPicker: {
        backgroundColor: Colors.navy[3],
        borderRadius: 48,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 108,
        height: 24
    },
});
