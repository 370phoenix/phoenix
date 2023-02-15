import { getAuth } from "firebase/auth/react-native";
import React, { useState } from "react";
import { TouchableWithoutFeedback, View, Keyboard, StyleSheet } from "react-native";
import uuid from "react-native-uuid";

import DateTimePicker from "./CustomDateTimePicker";
import CustomSwitch from "./CustomSwitch";
import MultilineInput from "./MultilineInput";
import NumberPicker from "./NumberPicker";
import PostValidation from "./PostValidation";
import { Button, Text } from "./Themed";
import LocationPicker, { LocationButton } from "../components/LocationPicker";
import { PostType, Coords } from "../constants/DataTypes";
import writeUserData from "../firebase/makePosts";
import { fire } from "../firebaseConfig";

// stores options for number picker form inputs

export default function CreatePostForm() {
    // date input
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    // location input
    const [pickup, setPickup] = useState<Coords | string>("");
    const [pickupText, setPickupText] = useState("");
    const [dropoff, setDropoff] = useState<Coords | string>("");
    const [dropoffText, setDropoffText] = useState("");
    const [isRoundtrip, setIsRoundtrip] = useState(true);
    const [numFriends, setNumFriends] = useState(0);
    const [numSeats, setNumSeats] = useState(1);
    const [notes, setNotes] = React.useState("");

    const onChangeNotes = (text: string) => setNotes(text);

    const addNumFriends = () => {
        if (numFriends < 6) setNumFriends(numFriends + 1);
    };
    const deleteNumFriends = () => {
        if (numFriends > 0) setNumFriends(numFriends - 1);
    };
    const addNumSeats = () => {
        if (numSeats < 6) setNumSeats(numSeats + 1);
    };
    const deleteNumSeats = () => {
        if (numSeats > 1) setNumSeats(numSeats - 1);
    };

    const onChangePickup = (text: string) => {
        setPickupText(text);
        setPickup(text);
    };
    const onChangeDropoff = (text: string) => {
        setDropoffText(text);
        setDropoff(text);
    };
    const onChangeStartTime = (event: any, selectedDate?: Date | undefined) => {
        setStartTime(selectedDate ?? startTime);
    };
    const onChangeEndTime = (event: any, selectedDate?: Date | undefined) => {
        setEndTime(selectedDate ?? endTime);
    };

    // change handler for round trip switch
    const roundtripSwitch = () => setIsRoundtrip((previousState) => !previousState);

    // find current userID
    const Auth = getAuth(fire);
    const user = Auth.currentUser;
    const userID = user ? user.uid : "No user found";
    // create object from form inputs on submit event
    const onSubmit = async () => {
        const Post: PostType = {
            pickup,
            dropoff,
            postID: uuid.v4(),
            numFriends,
            availableSpots: numSeats,
            notes,
            startTime: startTime.getTime(),
            endTime: endTime.getTime(),
            roundTrip: isRoundtrip,
            isMatched: false,
            isRequested: false,
            riders: [userID],
        };
        console.log(Post);
        // VALIDATE POST
        const writeComplete = await writeUserData(Post) ?? false;
        // if(writeComplete){
        //     // alert("Write to database complete!")
        // }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.body}>
                <Text style={styles.label}>From</Text>
                <LocationPicker
                    name="pickup"
                    setLocation={setPickup}
                    inputText={pickupText}
                    onChangeText={onChangePickup}
                />
                <LocationButton
                    setLocation={setPickup}
                    inputText={pickupText}
                    onChangeText={onChangePickup}
                />
                <Text style={styles.label}>To</Text>
                <LocationPicker
                    name="dropoff"
                    setLocation={setDropoff}
                    inputText={dropoffText}
                    onChangeText={onChangeDropoff}
                />
                <Text style={styles.label}>Round trip</Text>
                <CustomSwitch
                    isEnabled={isRoundtrip}
                    setIsEnabled={setIsRoundtrip}
                    toggleSwitch={roundtripSwitch}
                />
                <Text style={styles.label}>When do you want a ride?</Text>
                <DateTimePicker start={startTime} end={endTime} onChangeStart={onChangeStartTime} onChangeEnd={onChangeEndTime}/>
                <Text style={styles.label}>"How many friends are you riding with?"</Text>
                <NumberPicker
                    count={numFriends}
                    handlePlus={addNumFriends}
                    handleMinus={deleteNumFriends}
                />
                <Text style={styles.label}>"How many spots are available?"</Text>
                <NumberPicker
                    count={numSeats}
                    handlePlus={addNumSeats}
                    handleMinus={deleteNumSeats}
                />
                <Text style={styles.label}>Is there anything else your match needs to know?</Text>
                <MultilineInput value={notes} onChangeText={onChangeNotes} />
                <Button onPress={onSubmit} color="navy" title="Post" />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    body: {
        margin: 16,
        marginTop: 0,
    },
    label: {
        marginBottom: 8,
        marginTop: 16,
    },
});
