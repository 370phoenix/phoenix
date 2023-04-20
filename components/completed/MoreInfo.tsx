import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { firebase } from "@react-native-firebase/database";

import { View, Text, Spacer, Button, TextArea } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { FeedbackEntryType } from "../../utils/auth";
import { PostType } from "../../utils/postValidation";
import { AuthContext, userIDSelector, userInfoSelector } from "../../utils/machines/authMachine";
import { useMachine, useSelector } from "@xstate/react";
import { multipleUserMachine } from "../../utils/machines/multipleUserMachine";
import { pushFeedback } from "../../utils/feedback";
import UserList from "./UserList";

export default function MoreInfo({ post }: { post: PostType }) {
    const [state, send] = useMachine(multipleUserMachine);
    const { riders, error } = state.context;
    const [notes, setNotes] = useState();

    const authService: any = useContext(AuthContext);
    const id = useSelector(authService, userIDSelector);
    const userID = id ? id : "No user found";

    const [buttonText, setButtonText] = useState("Submit");

    const postID = post.postID;

    const timestamp = Date.now();

    if (state.matches("Start")) {
        const ids = post.riders ? post.riders : [];
        if (!ids.includes(post.user)) ids.push(post.user);
        send("LOAD", { ids });
    }

    const onSubmit = async () => {
        const feedback: FeedbackEntryType = {
            message: notes,
            postID: postID,
            userID: userID,
            timestamp: timestamp,
        };

        setButtonText("Submitted");

        pushFeedback(feedback);
    };

    // changed ride info --> ride feedback
    //commented out everything up until notes
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
