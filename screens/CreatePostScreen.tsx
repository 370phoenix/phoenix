import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { RootTabScreenProps } from "../types";
import DateTimePicker from "../components/DateTimePicker";

import CurrentLocation from "../components/LocationPicker";

export default function CreatePostScreen({ navigation }: RootTabScreenProps<"CreatePost">) {
    return (
        <View style={styles.container}>
            <CurrentLocation />
            <DateTimePicker />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.purple[2],
        height: 500
    },
    paragraph: {
        color: Colors.gray.b,
    },
});
