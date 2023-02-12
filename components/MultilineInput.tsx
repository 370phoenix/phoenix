import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export default function App() {
    const [value, onChangeText] = React.useState("");

    return (
        <View>
            <Text style={styles.label}>Is there anything else your match needs to know?</Text>
            <TextInput
                style={styles.multiline}
                editable
                multiline
                numberOfLines={4}
                placeholder={"notes"}
                placeholderTextColor={Colors.gray[2]}
                maxLength={40}
                onChangeText={(text) => onChangeText(text)}
                value={value}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    multiline: {
        borderBottomColor: Colors.gray.b,
        borderBottomWidth: 1,
        margin: 16,
        marginTop: 0,
        padding: 8
    },
    label: {
        marginLeft: 16,
        marginTop: 16
    },
});
