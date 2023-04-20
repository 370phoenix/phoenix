import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { firebase } from "@react-native-firebase/database";

import { View, Text, Spacer, Button, TextArea } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { FBPostType } from "../../utils/postValidation";
import { AuthContext, userIDSelector } from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";
import { pushFeedback } from "../../utils/feedback";
import UserList from "./UserList";

export default function FeedbackForm({ post }: { post: FBPostType }) {
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [recentlySubmitted, setRecentlySubmitted] = useState(false);
    const [buttonText, setButtonText] = useState("Submit");
    // const [seconds, startTimer] = useTimer();

    const authService = useContext(AuthContext);
    const userID = useSelector(authService, userIDSelector);

    if (!userID) throw new Error("MORE INFO NO USER: SHOULD NEVER HAPPEN");

    const postID = post.postID;
    const riders = post.riders ? Object.keys(post.riders) : [];

    // console.log(seconds);

    const onSubmit = async () => {
        try {
            setButtonText("Submitted");
            // startTimer();
            await pushFeedback({
                message: notes,
                postID: postID,
                userID: userID,
                timestamp: Date.now(),
            });
        } catch (e: any) {}
    };

    return (
        <View style={styles.infoContainer}>
            <Spacer direction="column" size={16} />
            <Text textStyle="header" styleSize="l">
                Ride Feedback
            </Text>
            <Spacer direction="column" size={16} />
            <Text textStyle="label" styleSize="l">
                Notes:
            </Text>
            <Spacer direction="column" size={16} />
            <TextArea
                label=""
                inputState={[notes, setNotes]}
                placeholder="Type feedback here..."
                placeholderTextColor={Colors.gray[2]}
            />
            <Button onPress={onSubmit} title={buttonText} color="purple" />
            <Spacer direction="column" size={48} />
            {riders && <UserList riders={riders} message={error} post={post} />}
        </View>
    );
}

//disabled={seconds > 0} for line 61

// export const useTimer = (): [number, () => void] => {
//     const [isActive, setIsActive] = useState(false);
//     const [seconds, setSeconds] = useState(0);
//     const timerRef = useRef<NodeJS.Timer | null>(null);

//     const startTimer = () => {
//         if (!isActive) {
//             setIsActive(true);
//             setSeconds(300);
//             timerRef.current = setInterval(() => {
//                 setSeconds((seconds) => seconds - 1);
//             }, 1000);
//         }
//     };

//     useEffect(() => {
//         if (seconds <= 0 && timerRef.current) {
//             clearInterval(timerRef.current);
//             timerRef.current = null;
//         }
//     }, [timerRef, seconds]);

//     return [seconds, startTimer];
// };

const styles = StyleSheet.create({
    background: {
        width: "100%",
    },
    container: {
        backgroundColor: Colors.gray[4],
        paddingHorizontal: 32,
    },
    infoContainer: {
        flex: 1,
    },
    footer: {
        backgroundColor: Colors.gray[4],
        height: 80,
        padding: 16,
    },
});
