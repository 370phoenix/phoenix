import React, { useState } from "react";
import {
    TouchableWithoutFeedback,
    View,
    Keyboard,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import uuid from "react-native-uuid";
import { useHeaderHeight } from "@react-navigation/elements";

import CustomDateTimePicker from "./CustomDateTimePicker";
import CustomSwitch from "./CustomSwitch";
import NumberPicker from "./NumberPicker";
import { Button, Text, Spacer, TextArea } from "./Themed";
import LocationPicker, { LocationButton } from "../components/LocationPicker";
import { PostType, Coords } from "../constants/DataTypes";
import writeUserData from "../firebase/makePosts";
import Colors from "../constants/Colors";
import { auth } from "../firebaseConfig";

// stores options for number picker form inputs

export default function CreatePostForm() {
    const height = useHeaderHeight();

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
    const user = auth.currentUser;
    const userID = user ? user.uid : "No user found";

    //error message
    const [message1, setMessage1] = React.useState<string | null>(null);
    const [message2, setMessage2] = React.useState<string | null>(null);
    const [message3, setMessage3] = React.useState<string | null>(null);
    const [message4, setMessage4] = React.useState<string | null>(null);

    // create object from form inputs on submit event
    const onSubmit = async () => {
        //validate;
        let isValid = true;

        if (startTime.getTime() === endTime.getTime()) {
            isValid = false;
            console.log("not valid date, no submit");
            setMessage1("Error: Invalid time window");
        }
        if (pickupText === "") {
            isValid = false;
            console.log("not valid pickup, no submit");
            setMessage2("Error: Invalid pickup location");
        }
        if (dropoffText === "") {
            isValid = false;
            console.log("not valid drop, no submit");
            setMessage3("Error: Invalid dropoff location");
            if (numFriends >= numSeats) {
                isValid = false;
                setMessage4("Error: Number of friends must be less than number of seats");
            }
        }

        // Push to database
        if (isValid) {
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

            //Verify completion
            const writeComplete = (await writeUserData(Post)) ?? false;

            Alert.alert("Post Completed", "You may close this window");

            //const writeComplete = (await writeUserData(Post)) ?? false;
            // if(writeComplete){
            //     // alert("Write to database complete!")
            // }
        }
    };

    return (
        <ScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.body}>
                    <Text textStyle="header" styleSize="l" style={styles.label}>
                        Create Post
                    </Text>
                    <Text textStyle="label" styleSize="l" style={styles.label}>
                        From
                    </Text>
                    <LocationPicker
                        name="pickup"
                        setLocation={setPickup}
                        inputText={pickupText}
                        onChangeText={onChangePickup}
                    />
                    {message2 ? <Text style={styles.message}>{message2}</Text> : ""}
                    <LocationButton
                        setLocation={setPickup}
                        inputText={pickupText}
                        onChangeText={onChangePickup}
                    />
                    <Text textStyle="label" styleSize="l" style={styles.label}>
                        To
                    </Text>
                    <LocationPicker
                        name="dropoff"
                        setLocation={setDropoff}
                        inputText={dropoffText}
                        onChangeText={onChangeDropoff}
                    />
                    {message3 ? <Text style={styles.message}>{message3}</Text> : ""}
                    <Text textStyle="label" styleSize="l" style={styles.label}>
                        Round trip
                    </Text>
                    <CustomSwitch
                        isEnabled={isRoundtrip}
                        setIsEnabled={setIsRoundtrip}
                        toggleSwitch={roundtripSwitch}
                    />
                    <Text textStyle="label" styleSize="l" style={styles.label}>
                        When do you want a ride?
                    </Text>
                    <CustomDateTimePicker
                        start={startTime}
                        end={endTime}
                        onChangeStart={onChangeStartTime}
                        onChangeEnd={onChangeEndTime}
                    />
                    {message1 ? <Text style={styles.message}>{message1}</Text> : ""}
                    <Text textStyle="label" styleSize="l" style={styles.label}>
                        How many friends are you riding with?
                    </Text>
                    <NumberPicker
                        count={numFriends}
                        handlePlus={addNumFriends}
                        handleMinus={deleteNumFriends}
                    />
                    <Text textStyle="label" styleSize="l" style={styles.label}>
                        How many spots are available?
                    </Text>
                    <NumberPicker
                        count={numSeats}
                        handlePlus={addNumSeats}
                        handleMinus={deleteNumSeats}
                    />
                    {message4 ? <Text style={styles.message}>{message4}</Text> : ""}

                    <Text textStyle="label" styleSize="l" style={styles.label}>
                        Is there anything else your match needs to know?
                    </Text>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        keyboardVerticalOffset={height}>
                        <TextArea label="Notes" inputState={[notes, setNotes]} />
                        <Button onPress={onSubmit} color="navy" title="Post" />
                        <Spacer direction="column" size={128} style={{ flex: 1 }} />
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    body: {
        margin: 16,
        marginTop: 0,
        height: "100%",
        justifyContent: "flex-end",
        flexDirection: "column",
    },
    label: {
        marginBottom: 8,
        marginTop: 16,
    },
    message: {
        paddingVertical: 10,
        color: Colors.red.p,
    },
});
