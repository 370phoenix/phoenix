import { useHeaderHeight } from "@react-navigation/elements";
import { useContext, useEffect, useState } from "react";
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
import { Coords, NewPostType } from "../../constants/DataTypes";
import { createPost } from "../../utils/posts";
import auth from "@react-native-firebase/auth";
import validateData, { MessageType } from "../../utils/postValidation";
import { AuthContext, userIDSelector, userInfoSelector } from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";
import * as Location from "expo-location";
import geocodeAddress from "../../utils/geocode";

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
    const [pickup, setPickup] = useState<string>("");
    const [pickupText, setPickupText] = useState("");
    const [dropoff, setDropoff] = useState<string>("");
    const [dropoffText, setDropoffText] = useState("");


    //used in reverse geocode functions
    const [pickupLocation, setPickupLocation] = useState<number[]>();
    const [dropoffLocation, setDropoffLocation] = useState<number[]>();
    const [address, setAddress] = useState("");
    const [address2, setAddress2] = useState("");

    const [curLocation, setCurLocation] = useState<Location.LocationObject>();

    const [isRoundtrip, setIsRoundtrip] = useState(false);
    const [numSeats, setNumSeats] = useState(1);
    const [notes, setNotes] = useState("");

    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setMessage('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCurLocation(location);
        })();
    }, []);

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

    //unused reverse geocode, not sure if we want this in app
    const reverseGeocodePickup = async (pCoords: number[]) => {

        if (pCoords[0] != null && pCoords[1] != null) {
            const reverseGeocodeAddress = await Location.reverseGeocodeAsync({
                longitude: pCoords[1],
                latitude: pCoords[0]
            })
            if (reverseGeocodeAddress != undefined) {
                setAddress(`${reverseGeocodeAddress[0].streetNumber} ${reverseGeocodeAddress[0].street}, ${reverseGeocodeAddress[0].city} ${reverseGeocodeAddress[0].region}, ${reverseGeocodeAddress[0].postalCode}`);
            }
            else {
                setMessage("famield to reverse geocode");
                return;
            }
        }
        else {
            setMessage("reverse geocode function failed");
            return;
        }
    };

    const reverseGeocodeDropoff = async (pCoords: number[]) => {

        if (pCoords[0] != null && pCoords[1] != null) {
            const reverseGeocodeAddress = await Location.reverseGeocodeAsync({
                longitude: pCoords[1],
                latitude: pCoords[0]
            })
            if (reverseGeocodeAddress != undefined) {
                setAddress2(`${reverseGeocodeAddress[0].streetNumber} ${reverseGeocodeAddress[0].street}, ${reverseGeocodeAddress[0].city} ${reverseGeocodeAddress[0].region}, ${reverseGeocodeAddress[0].postalCode}`);
            }
            else {
                setMessage("famield to reverse geocode");
                return;
            }
        }
        else {
            setMessage("reverse geocode function failed");
            return;
        }
    };

    // change handler for round trip switch
    const roundtripSwitch = () => setIsRoundtrip((previousState) => !previousState);



    //error message
    const [message1, setMessage1] = useState<string | null>(null);
    const [message2, setMessage2] = useState<string | null>(null);
    const [message3, setMessage3] = useState<string | null>(null);

    // create object from form inputs on submit event
    const onSubmit = async () => {

        let loc = await geocodeAddress(pickup);
        let pickupCoords = loc;

        let locD = await geocodeAddress(dropoff)
        let dropoffCoords = locD;

        //uses validation function
        //errors are displayed as error messages below
        const valid = await validateData({
            startTime: startTime,
            endTime: endTime,
            pickup: pickup,
            pickupCoords: pickupCoords,
            dropoff: dropoff,
            dropoffCoords: dropoffCoords,
            numSeats,
            notes: notes,

        });



        if (valid.type === MessageType.error) {
            setMessage(valid.message);
            return;
        }

        // Push to database
        if (valid.type === MessageType.success) {
            const post: NewPostType = {
                pickup,
                pickupCoords,
                dropoff,
                dropoffCoords,
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
            await createPost(post, userID, userInfo);

            Alert.alert("Post Completed", "You may close this window");
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
                    {message1 ? <Text style={styles.message}>{message1}</Text> : ""}

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
                        {message && (
                            <Text textStyle="label" styleSize="m" style={{ color: Colors.red.p }}>
                                {message}
                            </Text>
                        )}
                        <Button onPress={() => onSubmit()} color="navy" title="Post" />
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
