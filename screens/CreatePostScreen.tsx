import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { RootTabScreenProps } from "../types";

import CurrentLocation from "../components/LocationPicker";

export default function CreatePostScreen({ navigation }: RootTabScreenProps<"CreatePost">) {
    return <CurrentLocation />;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.purple[2],
    },
    paragraph: {
        color: Colors.gray.b,
    },
});
