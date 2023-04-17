/* eslint-disable react-hooks/rules-of-hooks */
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { firebase } from "@react-native-firebase/database";

import { Right } from "../../assets/icons/Arrow";
import RoundTrip from "../../assets/icons/RoundTrip";
import { View, Text, Spacer, Button, TextArea } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { PostType } from "../../constants/DataTypes";
import { RootStackParamList } from "../../types";
import { convertDate, convertLocation, convertTime } from "../../utils/convertPostTypes";
import { MessageType, UserInfo } from "../../utils/auth";
import { useHeaderHeight } from "@react-navigation/elements";
import { matchPost } from "../../utils/posts";
import { AuthContext, userIDSelector, userInfoSelector } from "../../utils/machines/authMachine";
import { useMachine, useSelector } from "@xstate/react";
import { multipleUserMachine } from "../../utils/machines/multipleUserMachine";
import { pushFeedback } from "../../utils/feedback";
import { FeedbackEntryType } from "../../constants/DataTypes";

type Props = NativeStackScreenProps<RootStackParamList, "PastPostDetails">; //change to "PastPostDetails"
export default function DetailsModal({ route }: Props) {
    if (!route.params) return <></>;
    const post = route.params.post;

    const [message, setMessage] = useState<string | null>(null);
    const authService = useContext(AuthContext);
    const userID = useSelector(authService, userIDSelector);

    const [notes, setNotes] = useState("");
    const onSubmit = useState<string>;

    return (
        <View style={styles.infoContainer}>
            <ScrollView directionalLockEnabled style={styles.container}>
                {message && (
                    <Text textStyle="label" style={{ color: Colors.red.p, textAlign: "center" }}>
                        {message}
                    </Text>
                )}

                {post && <MoreInfo post={post} />}
                <Spacer direction="column" size={32} />
            </ScrollView>
            <View
                style={{
                    backgroundColor: Colors.gray[4],
                    height: useHeaderHeight() + 16,
                    padding: 16,
                }}>
                <Button title="Submit" onPress={onSubmit} color="purple" />
                <Spacer direction="column" size={24} />
            </View>
        </View>
    );
}

function MoreInfo({ post }: { post: PostType }) {
    const [state, send] = useMachine(multipleUserMachine);
    const { riders, error } = state.context;
    const [notes, setNotes] = useState("");

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

//need this
function UserList({
    riders,
    message,
    post,
}: {
    riders: UserInfo[];
    message: string | null;
    post: PostType;
}) {
    let i = 1;
    //const onSubmit = useState<string>;
    return (
        <View style={{ marginTop: riders.length > 0 ? 0 : 20 }}>
            {message && (
                <Text textStyle="label" style={{ color: Colors.red.p, textAlign: "center" }}>
                    {message}
                </Text>
            )}
            {riders.length > 0 &&
                riders.map((match) => {
                    return (
                        <View key={Math.random()}>
                            <UserDetails num={i++} user={match} post={post} />
                            <Spacer direction="column" size={32} />
                        </View>
                    );
                })}
        </View>
    );
}

function UserDetails({ user, num, post }: { user: UserInfo; num: number; post: PostType }) {
    const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

    const userID = user.userID;
    const postID = post.postID;

    const rnsRef = db.ref("noShow").child(userID).child(postID);

    const onSubmit = async () => {
        rnsRef.set(true);
    };

    return (
        <View>
            <Text textStyle="header">{user.username}</Text>
            <Spacer direction="row" size={16} />
            <Button title="REPORT NO SHOW" onPress={onSubmit} color="purple" />
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
