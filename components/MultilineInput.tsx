import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import Colors from "../constants/Colors";

export default function MultilineInput({ value, onChangeText }: { value: string; onChangeText: any }) {
    return (
        <View>
            <TextInput
                style={styles.multiline}
                editable
                multiline
                numberOfLines={4}
                placeholder="notes"
                placeholderTextColor={Colors.gray[2]}
                maxLength={40}
                onChangeText={onChangeText}
                value={value}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    multiline: {
        borderBottomColor: Colors.gray.b,
        borderBottomWidth: 1,
        padding: 8,
        marginBottom: 16
    },
});
