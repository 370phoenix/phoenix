import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Colors from "../constants/Colors";
import { RootTabScreenProps } from "../types";
import DateTimePicker from "../components/DateTimePicker";

import CurrentLocation from "../components/LocationPicker";

export default function CreatePostScreen({ navigation }: RootTabScreenProps<"CreatePost">) {
    return (
        <ScrollView style={styles.container}>
            <View>
                <CurrentLocation name="pickup" />
                <CurrentLocation name="dropoff" />
                <DateTimePicker />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.purple[4]
    },
});
