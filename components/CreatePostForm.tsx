import React, { useState } from "react";
import { TouchableWithoutFeedback, View, StyleSheet, Keyboard } from "react-native";
import Colors from "../constants/Colors";
import DateTimePicker from "./DateTimePicker";
import Switch from "./Switch";
import MLTextInput from "./MultilineInput";
import NumberPicker from "./NumberPicker";
import { Button } from "./Themed";
import LocationPicker, { Location } from "../components/LocationPicker";
import uuid from "react-native-uuid";

type PostType = {
    pickup: Location.LocationObject | null | string;
    dropoff: Location.LocationObject | null | string;
    postID: number[] | string;
    numFriends: number;
    availableSpots: number;
    notes: string;
    dateTime: Date;
    roundTrip: boolean;
};

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

export default function App() {
    // date input
    const [date, setDate] = useState(new Date());
    // location input
    const [pickup, setPickup] = useState<Location.LocationObject | string | null>(null);
    const [pickupText, setPickupText] = useState("");
    const [dropoff, setDropoff] = useState<Location.LocationObject | string | null>(null);
    const [dropoffText, setDropoffText] = useState("");
    const [isRoundtrip, setIsRoundtrip] = useState(true);
    const [numFriends, setNumFriends] = useState(0);
    const [numSeats, setNumSeats] = useState(1);
    const [notes, setNotes] = React.useState("");

    const onChangeNotes = (text: string) => setNotes(text);
    const onChangeFriends = (selectedItem: any) => {
        setNumFriends(selectedItem.value);
    };
    const onChangeSeats = (selectedItem: any) => {
        setNumSeats(selectedItem.value);
    };
    const onChangePickup = (text: string) => {
        setPickupText(text);
        setPickup(text);
    };
    const onChangeDropoff = (text: string) => {
        setDropoffText(text);
        setDropoff(text);
    };
    const onChangeDate = (event: any, selectedDate?: Date | undefined) => {
        setDate(selectedDate || date);
    };

    // change handler for round trip switch
    const roundtripSwitch = () => setIsRoundtrip((previousState) => !previousState);

    // create object from form inputs on submit event
    const onSubmit = () => {
        const Post: PostType = {
            pickup: pickup,
            dropoff: dropoff,
            postID: uuid.v4(),
            numFriends: numFriends,
            availableSpots: numSeats,
            notes: notes,
            dateTime: date,
            roundTrip: isRoundtrip,
        };
        console.log(Post);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <LocationPicker
                    name="pickup"
                    setLocation={setPickup}
                    inputText={pickupText}
                    onChangeText={onChangePickup}
                />
                <LocationPicker
                    name="dropoff"
                    setLocation={setDropoff}
                    inputText={dropoffText}
                    onChangeText={onChangeDropoff}
                />
                <Switch
                    label="Round trip"
                    isEnabled={isRoundtrip}
                    setIsEnabled={setIsRoundtrip}
                    toggleSwitch={roundtripSwitch}
                />
                <DateTimePicker date={date} onChange={onChangeDate} />
                <NumberPicker
                    input={friends}
                    label="How many friends are you riding with?"
                    onChange={onChangeFriends}
                    selected={numFriends}
                />
                <NumberPicker
                    input={seats}
                    label="How many spots are available?"
                    onChange={onChangeSeats}
                    selected={numSeats}
                />
                <MLTextInput value={notes} onChangeText={onChangeNotes} />
                <Button onPress={onSubmit} color="navy" title="Post"></Button>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.purple[4],
        color: Colors.gray[4],
    },
});
