import { useHeaderHeight } from "@react-navigation/elements";
import { useContext, useState, useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import CustomDateTimePicker from "../shared/CustomDateTimePicker";
import CustomSwitch from "../shared/CustomSwitch";
import NumberPicker from "../shared/NumberPicker";
import { Button, Text, Spacer, TextArea } from "../shared/Themed";
import LocationPicker, { LocationButton } from "../shared/LocationPicker";
import Colors from "../../constants/Colors";
import { createPost } from "../../utils/posts";
import validateData, { Coords } from "../../utils/postValidation";
import { AuthContext, userInfoSelector } from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";
import SuccessfulPost from "../shared/SuccessPage";
import { z } from "zod";
import { logError } from "../../utils/errorHandling";

// FIXME: too much state going on here
export default function CreatePostForm({ navigation }: { navigation: any }) {
    const headerHeight = useHeaderHeight();
    const authService: any = useContext(AuthContext);
    const userInfo = useSelector(authService, userInfoSelector);

    // date time state
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    // location state
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const pickupCoords = useRef<Coords | null>(null);

    const [roundTrip, setRoundTrip] = useState(false);
    const [freeSpots, setFreeSpots] = useState(1);
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState<Error | null>(null);
    const [writeComplete, setWriteComplete] = useState<boolean | string>(false);

    // contains constraints for modifying seats
    const addTotalSpots = () => {
        if (freeSpots < 6) setFreeSpots((freeSpots) => freeSpots + 1);
    };
    const deleteTotalSpots = () => {
        if (freeSpots > 1) setFreeSpots((freeSpots) => freeSpots - 1);
    };

    const onChangePickup = (text: any) => {
        setPickup(text);
    };
    const onChangeDropoff = (text: any) => {
        setDropoff(text);
    };
    // change handler for round trip switch
    const roundtripSwitch = () => setRoundTrip((previousState) => !previousState);

    //error message

    if (!userInfo) return <></>;
    const { userID } = userInfo;

    // create object from form inputs on submit event
    const onSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        //errors are displayed as error messages below
        try {
            const validatedPost = await validateData({
                user: userID,
                pickup,
                dropoff,
                startTime,
                endTime,
                totalSpots: freeSpots + 1,
                notes,
                roundTrip,
            });
            setError(null);
            await createPost(validatedPost, userInfo);
            setWriteComplete(true);
            setSubmitting(false);
            setTimeout(() => {
                if (navigation.canGoBack()) navigation.goBack();
            }, 500);
        } catch (e: any) {
            setSubmitting(false);
            logError(e);
            setError(e);
        }
    };

    if (writeComplete) return <SuccessfulPost message="SUCCESSFULLY POSTED!" />;

    return (
        <ScrollView>
            <View style={styles.body}>
                <Text style={styles.header} textStyle="header" styleSize="l">
                    Create Post
                </Text>

                {error &&
                    (error instanceof z.ZodError ? (
                        error.issues.map((err, i) => <ErrorBox message={err.message} key={i} />)
                    ) : (
                        <ErrorBox message={error.message} />
                    ))}

                <TripDetails
                    pickup={pickup}
                    pickupCoords={pickupCoords}
                    onChangePickup={onChangePickup}
                    dropoff={dropoff}
                    onChangeDropoff={onChangeDropoff}
                    error={error}
                />

                <DateTimeGroup
                    start={startTime}
                    onChangeStart={setStartTime}
                    end={endTime}
                    onChangeEnd={setEndTime}
                />

                <View style={styles.formRow}>
                    <Text textStyle="lineTitle">ROUND TRIP?</Text>
                    <Spacer direction="row" size={24} />
                    <CustomSwitch isEnabled={roundTrip} toggleSwitch={roundtripSwitch} />
                </View>

                <Text textStyle="label" styleSize="l">
                    Notes for riders?
                </Text>
                <TextArea
                    label=""
                    textStyle={["body", "s"]}
                    style={styles.notes}
                    inputState={[notes, setNotes]}
                    placeholder="Type here..."
                    placeholderTextColor={Colors.gray[2]}
                />

                <View style={styles.freeSeats}>
                    <Text textStyle="lineTitle">NUMBER OF FREE SEATS?</Text>
                    <NumberPicker
                        count={freeSpots}
                        handlePlus={addTotalSpots}
                        handleMinus={deleteTotalSpots}
                    />
                </View>

                <Spacer direction="column" size={120} style={{ flex: 1 }} />

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
}

interface TripDetailsProps {
    onChangePickup: (text: any) => void;
    onChangeDropoff: (text: any) => void;
    dropoff: string;
    pickup: string;
    pickupCoords: React.MutableRefObject<Coords | null>;
    error: Error | null;
}
const TripDetails = ({
    onChangePickup,
    onChangeDropoff,
    dropoff,
    pickup,
    pickupCoords,
    error,
}: TripDetailsProps) => {
    // TOOD: UPDATE ADDRESS ERROR
    const pickupError = error?.message.includes("pickup") ?? false;
    const dropoffError = error?.message.includes("dropoff") ?? false;
    return (
        <View style={styles.tripDetails}>
            <LocationPicker
                name="From"
                inputText={pickup}
                onChangeText={onChangePickup}
                addressError={pickupError}
            />
            <LocationButton
                setLocation={(coords) => (pickupCoords.current = coords)}
                onChangeText={onChangePickup}
            />
            <LocationPicker
                name="To"
                inputText={dropoff}
                onChangeText={onChangeDropoff}
                addressError={dropoffError}
            />
        </View>
    );
};

interface ErrorBoxProps {
    message: string;
}
export const ErrorBox = ({ message }: ErrorBoxProps) => {
    return (
        <View style={styles.errorBox}>
            <Text style={styles.errorText} textStyle="body" styleSize="m">
                {message}
            </Text>
        </View>
    );
};

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
            <View style={styles.formRow}>
                <Text style={styles.lineTitle} textStyle="lineTitle">
                    DATE
                </Text>
                <CustomDateTimePicker mode="date" date={start} onConfirm={onChangeStart} />
            </View>
            <View style={styles.formRow}>
                <Text style={styles.lineTitle} textStyle="lineTitle">
                    TIME
                </Text>
                <CustomDateTimePicker mode="time" date={start} onConfirm={onChangeStart} />
                <Text style={styles.divider} textStyle="body">
                    to
                </Text>
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
    tripDetails: {
        marginVertical: 16,
        alignItems: "flex-start",
    },
    formRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    freeSeats: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
    },
    header: {
        marginTop: 24,
    },
    lineTitle: {
        marginRight: 8,
    },
    divider: {
        marginHorizontal: 8,
    },
    message: {
        paddingVertical: 10,
        color: Colors.red.p,
    },
    notes: {
        marginTop: 8,
    },
    errorBox: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: Colors.red[1],
        opacity: 0.8,
        marginTop: 16,
    },
    errorText: {
        color: Colors.gray.w,
    },
});
