import { useHeaderHeight } from "@react-navigation/elements";
import { useState } from "react";
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

import CustomDateTimePicker from "../shared/CustomDateTimePicker";
import CustomSwitch from "../shared/CustomSwitch";
import NumberPicker from "../shared/NumberPicker";
import { Button, Text, Spacer, TextArea } from "../shared/Themed";
<<<<<<< HEAD
import LocationPicker, {LocationButton} from "../shared/LocationPicker";
=======
import LocationPicker, { LocationButton } from "../shared/LocationPicker";
>>>>>>> main
import Colors from "../../constants/Colors";
import { PostType, Coords, NewPostType } from "../../constants/DataTypes";
import { createPost } from "../../utils/posts";
import auth from "@react-native-firebase/auth";
<<<<<<< HEAD
import SuccessfulPost from "./SuccessfulPost";
=======
>>>>>>> main

// stores options for number picker form inputs

export default function CreatePostForm() {
<<<<<<< HEAD
=======
    const height = useHeaderHeight();

>>>>>>> main
    // date time state
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    // location state
    const [pickup, setPickup] = useState<Coords | string>("");
    const [pickupText, setPickupText] = useState("");
    const [dropoff, setDropoff] = useState<Coords | string>("");
    const [dropoffText, setDropoffText] = useState("");

<<<<<<< HEAD
    const [isRoundtrip, setIsRoundtrip] = useState(true);
=======
    const [isRoundtrip, setIsRoundtrip] = useState(false);
>>>>>>> main
    const [numSeats, setNumSeats] = useState(1);
    const [notes, setNotes] = useState("");

    // contains constraints for modifying seats
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

    // change handler for round trip switch
    const roundtripSwitch = () => setIsRoundtrip((previousState) => !previousState);

    // find current userID
    const user = auth().currentUser;
    const userID = user ? user.uid : "No user found";

    //error message
    const [message1, setMessage1] = useState<string | null>(null);
    const [message2, setMessage2] = useState<string | null>(null);
    const [message3, setMessage3] = useState<string | null>(null);

<<<<<<< HEAD
    const [writeComplete, setWriteComplete] = useState<boolean | string>(false);

=======
>>>>>>> main
    // create object from form inputs on submit event
    const onSubmit = async () => {
        //validate;
        let isValid = true;

        if (startTime.getTime() === endTime.getTime()) {
            isValid = false;
            setMessage1("Error: Invalid time window");
        }
        if (pickupText === "") {
            isValid = false;
            setMessage2("Error: Invalid pickup location");
        }
        if (dropoffText === "") {
            isValid = false;
            setMessage3("Error: Invalid dropoff location");
        }

        // Push to database
        if (isValid) {
            const post: NewPostType = {
                pickup,
                dropoff,
                totalSpots: numSeats,
                notes,
                startTime: startTime.getTime(),
                endTime: endTime.getTime(),
                roundTrip: isRoundtrip,
                user: userID,
                riders: [],
                pending: [],
            };

            //Verify completion
            await createPost(post, user);
<<<<<<< HEAD
            setWriteComplete(true);

=======

            Alert.alert("Post Completed", "You may close this window");
>>>>>>> main
        }
    };

    // group contains location and round trip info
    const TripDetails = (
        <>
<<<<<<< HEAD
            <LocationPicker name="From" inputText={pickupText} onChangeText={onChangePickup} />
            {message2 ? <Text style={styles.message}>{message2}</Text> : ""}
            <View>
                <LocationButton
                    setLocation={setPickup}
                    inputText={pickupText}
                    onChangeText={onChangePickup}
                />
            </View>
            <LocationPicker name="To" inputText={dropoffText} onChangeText={onChangeDropoff} />
            {message3 ? <Text style={styles.message}>{message3}</Text> : ""}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
                <Text textStyle="lineTitle">ROUND TRIP?</Text>
                <Spacer direction="row" size={24} />
                <CustomSwitch isEnabled={isRoundtrip} toggleSwitch={roundtripSwitch} />
=======
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
            <View style={{ alignItems: "flex-start" }}>
                <CustomSwitch
                    isEnabled={isRoundtrip}
                    setIsEnabled={setIsRoundtrip}
                    toggleSwitch={roundtripSwitch}
                />
>>>>>>> main
            </View>
        </>
    );

<<<<<<< HEAD
    const Form = (
        <ScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.body}>
                    <Spacer direction="column" size={24} />
                    <Text textStyle="header" styleSize="l">
                        Create Post
                    </Text>
                    <Spacer direction="column" size={16} />
                    {TripDetails}
                    <Spacer direction="column" size={16} />
=======
    return (
        <ScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.body}>
                    <Text textStyle="header" styleSize="l" style={styles.label}>
                        Create Post
                    </Text>
                    {TripDetails}

>>>>>>> main
                    <DateTimeGroup
                        start={startTime}
                        onChangeStart={setStartTime}
                        end={endTime}
                        onChangeEnd={setEndTime}
                    />
                    {message1 ? <Text style={styles.message}>{message1}</Text> : ""}

<<<<<<< HEAD
                    <Spacer direction="column" size={16} />
                    <Text textStyle="label" styleSize="l">
                        Notes for riders?
                    </Text>
                    <Spacer direction="column" size={8} />
                    <TextArea
                        label=""
                        inputState={[notes, setNotes]}
                        placeholder="Type here..."
                        placeholderTextColor={Colors.gray[2]}
                    />
                    <Spacer direction="column" size={16} />
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                        <Text textStyle="lineTitle">NUMBER OF FREE SEATS?</Text>
                        <NumberPicker
                            count={numSeats}
                            handlePlus={addNumSeats}
                            handleMinus={deleteNumSeats}
                        />
                    </View>
                    <Spacer direction="column" size={16} style={{ flex: 1 }} />
                    <Spacer direction="column" size={128} style={{ flex: 1 }} />
                    <Button
                        onPress={onSubmit}
                        color="navy"
                        title="Post"
                        style={{ justifyContent: "flex-end" }}
                    />
                    <Spacer direction="column" size={128} style={{ flex: 1 }} />
=======
                    <Text textStyle="label" styleSize="l" style={styles.label}>
                        How many free spots in the car?
                    </Text>
                    <NumberPicker
                        count={numSeats}
                        handlePlus={addNumSeats}
                        handleMinus={deleteNumSeats}
                    />

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
>>>>>>> main
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
<<<<<<< HEAD

    return (
        <>
            {writeComplete && <SuccessfulPost />}
            {!writeComplete && Form}
        </>
    );
=======
>>>>>>> main
}

const DateTimeGroup = ({
    start,
    onChangeStart,
    end,
    onChangeEnd,
}: {
    start: Date;
    onChangeStart: any;
    end: Date;
    onChangeEnd: any;
}) => {
    return (
<<<<<<< HEAD
        <>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text textStyle="lineTitle">DATE</Text>
                <Spacer direction="row" size={8} />
                <CustomDateTimePicker mode="date" date={start} onConfirm={onChangeStart} />
            </View>
            <Spacer direction="column" size={16} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text textStyle="lineTitle">TIME</Text>
                <Spacer direction="row" size={8} />
                <CustomDateTimePicker mode="time" date={start} onConfirm={onChangeStart} />
                <Spacer direction="row" size={8} />
                <CustomDateTimePicker mode="time" date={end} onConfirm={onChangeEnd} />
            </View>
        </>
=======
        <View>
            <Text textStyle="label" styleSize="l" style={styles.label}>
                When do you want a ride?
            </Text>
            {Platform.OS !== "ios" && (
                <>
                    <CustomDateTimePicker mode="date" date={start} onConfirm={onChangeStart} />
                    <Text textStyle="label" styleSize="m" style={styles.label}>
                        Between
                    </Text>
                    <CustomDateTimePicker mode="time" date={start} onConfirm={onChangeStart} />
                    <Text textStyle="label" styleSize="m" style={styles.label}>
                        And
                    </Text>
                    <CustomDateTimePicker mode="time" date={end} onConfirm={onChangeEnd} />
                </>
            )}
            {Platform.OS === "ios" && (
                <>
                    <Text textStyle="label" styleSize="m" style={styles.label}>
                        Between
                    </Text>
                    <CustomDateTimePicker mode="datetime" date={start} onConfirm={onChangeStart} />
                    <Text textStyle="label" styleSize="m" style={styles.label}>
                        And
                    </Text>
                    <CustomDateTimePicker mode="datetime" date={end} onConfirm={onChangeEnd} />
                </>
            )}
        </View>
>>>>>>> main
    );
};

const styles = StyleSheet.create({
    body: {
        margin: 16,
        marginTop: 0,
        height: "100%",
<<<<<<< HEAD
        justifyContent: "flex-start",
        flexDirection: "column",
    },
=======
        justifyContent: "flex-end",
        flexDirection: "column",
    },
    label: {
        marginBottom: 8,
        marginTop: 16,
    },
>>>>>>> main
    message: {
        paddingVertical: 10,
        color: Colors.red.p,
    },
});
