import React from "react";
import {
    TouchableWithoutFeedback,
    Keyboard,
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
} from "react-native";
import Colors from "../constants/Colors";
import { RootTabScreenProps } from "../types";
import DateTimePicker from "../components/DateTimePicker";
import Switch from "../components/Switch";
import MLTextInput from "../components/MultilineInput";
import NumberPicker from "../components/NumberPicker";
import { Button } from "../components/Themed";
import { useHeaderHeight } from "@react-navigation/elements";
import LocationPicker, { Location } from "../components/LocationPicker";

type PostType = {
    pickup: Location.LocationObject;
    dropoff: Location.LocationObject;
    postID: number;
    numFriends: number;
    availableSpots: number;
    notes: string;
    dateTime: Date;
    roundTrip: boolean
}

// stores options for number picker form inputs
const friends = [
    {
        name: "0",
        value: 0,
    },
    {
        name: "1",
        value: 1,
    },
    {
        name: "2",
        value: 2,
    },
    {
        name: "3",
        value: 3,
    },
    {
        name: "4",
        value: 4,
    },
];
const seats = [
    {
        name: "1",
        value: 1,
    },
    {
        name: "2",
        value: 2,
    },
    {
        name: "3",
        value: 3,
    },
    {
        name: "4",
        value: 4,
    },
    {
        name: "5",
        value: 5,
    },
];

// TODO: Fix text input interaction with keyboard, currently location inputs are blocked by keyboard
export default function CreatePostScreen({ navigation }: RootTabScreenProps<"CreatePost">) {
    const height = useHeaderHeight();
    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
                behavior={"position"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={height}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        <LocationPicker name="pickup" />
                        <LocationPicker name="dropoff" />
                        <Switch label="Round trip" />
                        <DateTimePicker />
                        <NumberPicker
                            input={friends}
                            label="How many friends are you riding with?"
                        />
                        <NumberPicker input={seats} label="How many spots are available?" />
                        <MLTextInput />
                        <Button onPress={() => {}} color="navy" title="Post"></Button>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.purple[4],
        color: Colors.gray[4],
    },
});
