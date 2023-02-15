import { useState } from "react";
import { StyleSheet } from "react-native";

import {
    Button,
    LabeledSwitch,
    Spacer,
    Text,
    TextArea,
    TextField,
    ValidationState,
    View,
} from "../components/Themed";

export default function TabTwoScreen() {
    const [on, setOn] = useState(false);
    const [valid, setValid] = useState(ValidationState.error);

    return (
        <View style={styles.container}>
            <Text>Tab 2</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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
