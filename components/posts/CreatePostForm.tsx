import { useHeaderHeight } from "@react-navigation/elements";
import { useContext, useState } from "react";
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

import CustomDateTimePicker from "../shared/CustomDateTimePicker";
import CustomSwitch from "../shared/CustomSwitch";
import NumberPicker from "../shared/NumberPicker";
import { Button, Text, Spacer, TextArea } from "../shared/Themed";
import LocationPicker, { LocationButton } from "../shared/LocationPicker";
import Colors from "../../constants/Colors";
import { NewPostType } from "../../constants/DataTypes";
import { createPost } from "../../utils/posts";
import validateData from "../../utils/postValidation";
import { AuthContext, userIDSelector, userInfoSelector } from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";

// stores options for number picker form inputs

export default function CreatePostForm() {
    const height = useHeaderHeight();
    const authService = useContext(AuthContext);
    const id = useSelector(authService, userIDSelector);
    const userID = id ? id : "No user found";
    const userInfo = useSelector(authService, userInfoSelector);

    // date time state
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    // location state
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");

    const [isRoundtrip, setIsRoundtrip] = useState(false);
    const [totalSpots, setTotalSpots] = useState(1);
    const [notes, setNotes] = useState("");

    const [message, setMessage] = useState<string | null>(null);

    // contains constraints for modifying seats
    const addTotalSpots = () => {
        if (totalSpots < 6) setTotalSpots(totalSpots + 1);
    };
    const deleteTotalSpots = () => {
        if (totalSpots > 1) setTotalSpots(totalSpots - 1);
    };

    const onChangePickup = (text: any) => {
        setPickup(text);
    };
    const onChangeDropoff = (text: any) => {
        setDropoff(text);
    };
    // change handler for round trip switch
    const roundtripSwitch = () => setIsRoundtrip((previousState) => !previousState);

    // create object from form inputs on submit event
    const onSubmit = async () => {
        //uses validation function
        const post: NewPostType = {
            pickup,
            dropoff,
            pickupCoords: undefined,
            dropoffCoords: undefined,
            user: userID,
            riders: [],
            pending: [],
            totalSpots,
            notes,
            roundTrip: isRoundtrip,
            startTime: startTime.getTime(),
            endTime: endTime.getTime(),
        };
        //errors are displayed as error messages below
        try {
            const validatedPost = await validateData({ post });
            await createPost(validatedPost, userID, userInfo);
            Alert.alert("Post Completed", "You may close this window");
        } catch (e: any) {
            setMessage(e.message);
        }
    };

    // group contains location and round trip info
    const TripDetails = (
        <>
            <Text textStyle="label" styleSize="l" style={styles.label}>
                From
            </Text>
            <LocationPicker
                name="pickup"
                setLocation={setPickup}
                inputText={pickup}
                onChangeText={onChangePickup}
            />
            <LocationButton
                setLocation={setPickup}
                inputText={pickup}
                onChangeText={onChangePickup}
            />
            <Text textStyle="label" styleSize="l" style={styles.label}>
                To
            </Text>
            <LocationPicker
                name="dropoff"
                setLocation={setDropoff}
                inputText={dropoff}
                onChangeText={onChangeDropoff}
            />
            <Text textStyle="label" styleSize="l" style={styles.label}>
                Round trip
            </Text>
            <View style={{ alignItems: "flex-start" }}>
                <CustomSwitch
                    isEnabled={isRoundtrip}
                    setIsEnabled={setIsRoundtrip}
                    toggleSwitch={roundtripSwitch}
                />
            </View>
        </>
    );

    return (
        <ScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.body}>
                    <Text textStyle="header" styleSize="l" style={styles.label}>
                        Create Post
                    </Text>
                    {TripDetails}

                    <DateTimeGroup
                        start={startTime}
                        onChangeStart={setStartTime}
                        end={endTime}
                        onChangeEnd={setEndTime}
                    />

                    <Text textStyle="label" styleSize="l" style={styles.label}>
                        How many free spots in the car?
                    </Text>
                    <NumberPicker
                        count={totalSpots}
                        handlePlus={addTotalSpots}
                        handleMinus={deleteTotalSpots}
                    />

                    <Text textStyle="label" styleSize="l" style={styles.label}>
                        Is there anything else your match needs to know?
                    </Text>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        keyboardVerticalOffset={height}>
                        <TextArea label="Notes" inputState={[notes, setNotes]} />
                        {message && (
                            <Text textStyle="label" styleSize="m" style={{ color: Colors.red.p }}>
                                {message}
                            </Text>
                        )}
                        <Button onPress={onSubmit} color="navy" title="Post" />
                        <Spacer direction="column" size={128} style={{ flex: 1 }} />
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
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
    );
};

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
