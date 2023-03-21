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
import LocationPicker, { LocationButton } from "../shared/LocationPicker";
import Colors from "../../constants/Colors";
import { PostType, Coords, NewPostType } from "../../constants/DataTypes";
import { createPost } from "../../utils/posts";
import auth from "@react-native-firebase/auth";
import SuccessfulPost from "./SuccessfulPost";

// stores options for number picker form inputs

export default function CreatePostForm() {
    const height = useHeaderHeight();

    // date time state
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    // location state
    const [pickup, setPickup] = useState<Coords | string>("");
    const [pickupText, setPickupText] = useState("");
    const [dropoff, setDropoff] = useState<Coords | string>("");
    const [dropoffText, setDropoffText] = useState("");

    const [isRoundtrip, setIsRoundtrip] = useState(false);
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

    const [writeComplete, setWriteComplete] = useState<boolean | string>(false);

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
            setWriteComplete(true);

        }
    };

    // group contains location and round trip info
    const TripDetails = (
        <>
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
            </View>
        </>
    );

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
                    <DateTimeGroup
                        start={startTime}
                        onChangeStart={setStartTime}
                        end={endTime}
                        onChangeEnd={setEndTime}
                    />
                    {message1 ? <Text style={styles.message}>{message1}</Text> : ""}

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
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );

    return (
        <>
            {writeComplete && <SuccessfulPost />}
            {!writeComplete && Form}
        </>
    );
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
    );
};

const styles = StyleSheet.create({
    body: {
        margin: 16,
        marginTop: 0,
        height: "100%",
        justifyContent: "flex-start",
        flexDirection: "column",
    },
    message: {
        paddingVertical: 10,
        color: Colors.red.p,
    },
});
