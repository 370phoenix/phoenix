import { useContext, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

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
import SuccessfulPost from "../shared/SuccessPage";

// stores options for number picker form inputs
type Coords = {
    lat: number;
    long: number;
};

// FIXME: too much state going on here
export default function CreatePostForm({ navigation }: { navigation: any }) {
    const headerHeight = useHeaderHeight();
    const authService: any = useContext(AuthContext);
    const id = useSelector(authService, userIDSelector);
    const userID = id ? id : "No user found";
    const userInfo = useSelector(authService, userInfoSelector);

    // date time state
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    // location state
    const [pickup, setPickup] = useState("");
    const [pickupCoords, setPickupCoords] = useState<Coords | undefined>(undefined);
    const [dropoff, setDropoff] = useState("");
    const [dropoffCoords, setDropoffCoords] = useState<Coords | undefined>(undefined);
    // TODO: Why is this never changed? (setDropoffCoords)

    const [isRoundtrip, setIsRoundtrip] = useState(false);
    const [totalSpots, setTotalSpots] = useState(1);
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [message, setMessage] = useState<string | null>(null);

    // contains constraints for modifying seats
    const addTotalSpots = () => {
        if (totalSpots < 6) setTotalSpots((totalSpots) => totalSpots + 1);
    };
    const deleteTotalSpots = () => {
        if (totalSpots > 1) setTotalSpots((totalSpots) => totalSpots - 1);
    };

    const onChangePickup = (text: any) => {
        setPickup(text);
    };
    const onChangeDropoff = (text: any) => {
        setDropoff(text);
    };
    // change handler for round trip switch
    const roundtripSwitch = () => setIsRoundtrip((previousState) => !previousState);

    //error message
    const [writeComplete, setWriteComplete] = useState<boolean | string>(false);

    // create object from form inputs on submit event
    const onSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        //uses validation function
        const post: NewPostType = {
            pickup,
            dropoff,
            pickupCoords,
            dropoffCoords,
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
            setWriteComplete(true);
            setSubmitting(false);
            setTimeout(() => {
                if (navigation.canGoBack()) navigation.goBack();
            }, 500);
        } catch (e: any) {
            setSubmitting(false);
            setMessage(e.message);
        }
    };

    // group contains location and round trip info
    const TripDetails = (
        <>
            <LocationPicker name="From" inputText={pickup} onChangeText={onChangePickup} />
            <View>
                <LocationButton setLocation={setPickupCoords} onChangeText={onChangePickup} />
            </View>
            <LocationPicker name="To" inputText={dropoff} onChangeText={onChangeDropoff} />
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
                <Text textStyle="lineTitle">ROUND TRIP?</Text>
                <Spacer direction="row" size={24} />
                <CustomSwitch isEnabled={isRoundtrip} toggleSwitch={roundtripSwitch} />
            </View>
        </>
    );

    const Form = (
        <ScrollView>
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
                        count={totalSpots}
                        handlePlus={addTotalSpots}
                        handleMinus={deleteTotalSpots}
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
                            count={totalSpots}
                            handlePlus={addTotalSpots}
                            handleMinus={deleteTotalSpots}
                        />
                    </View>
                    <Spacer direction="column" size={16} style={{ flex: 1 }} />
                    {message && (
                        <Text textStyle="label" styleSize="m" style={{ color: Colors.red.p }}>
                            {message}
                        </Text>
                    )}
                    {!message && <Spacer direction="column" size={128} style={{ flex: 1 }} />}
                    {message && <Spacer direction="column" size={112} style={{ flex: 1 }} />}
                    <Button
                        onPress={onSubmit}
                        color="navy"
                        title="Post"
                        style={{ height: headerHeight + 32 }}
                    />
                    <Spacer direction="column" size={128} style={{ flex: 1 }} />
                </View>
                <Spacer direction="column" size={16} style={{ flex: 1 }} />
                {message && (
                    <Text textStyle="label" styleSize="m" style={{ color: Colors.red.p }}>
                        {message}
                    </Text>
                )}
                {!message && <Spacer direction="column" size={128} style={{ flex: 1 }} />}
                {message && <Spacer direction="column" size={112} style={{ flex: 1 }} />}
                <Button
                    disabled={submitting}
                    onPress={onSubmit}
                    color="navy"
                    title="Post"
                    style={{ height: headerHeight + 32 }}
                />
                <Spacer direction="column" size={128} style={{ flex: 1 }} />
            </View>
        </ScrollView>
    );

    return (
        <>
            {writeComplete && <SuccessfulPost message="SUCCESSFULLY POSTED!" />}
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
