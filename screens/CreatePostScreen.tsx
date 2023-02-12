import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Colors from "../constants/Colors";
import { RootTabScreenProps } from "../types";
import DateTimePicker from "../components/DateTimePicker";
import Switch from "../components/Switch";

import LocationPicker from "../components/LocationPicker";

export default function CreatePostScreen({ navigation }: RootTabScreenProps<"CreatePost">) {
    return (
        <ScrollView style={styles.container}>
            <View>
                <LocationPicker name="pickup" />
                <LocationPicker name="dropoff" />
                <Switch label="Round trip?" />
                <DateTimePicker />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.purple[4],
        color: Colors.gray[4],
    },
});
