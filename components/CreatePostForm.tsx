import React, { useState } from "react";
import { TouchableWithoutFeedback, View, Keyboard } from "react-native";
import uuid from "react-native-uuid";

import DateTimePicker from "./DateTimePicker";
import MLTextInput from "./MultilineInput";
import NumberPicker from "./NumberPicker";
import PostValidation from "./PostValidation";
import Switch from "./Switch";
import { Button } from "./Themed";
import LocationPicker, { Location } from "../components/LocationPicker";
import { PostType } from "../constants/DataTypes";

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
        setDate(selectedDate ?? date);
    };

    // change handler for round trip switch
    const roundtripSwitch = () => setIsRoundtrip((previousState) => !previousState);

    // create object from form inputs on submit event
    const onSubmit = () => {
        const Post: PostType = {
            pickup,
            dropoff,
            postID: uuid.v4(),
            numFriends,
            availableSpots: numSeats,
            notes,
            dateTime: date,
            roundTrip: isRoundtrip,
            isMatched: [],
            isRequested: [],
            // TODO: get poster's UserID and add to list
            riders: []
        };
        console.log(Post);
        // VALIDATE POST AND WRITE TO DATABASE
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
                <Button onPress={onSubmit} color="navy" title="Post" />
            </View>
        </TouchableWithoutFeedback>
    );
}