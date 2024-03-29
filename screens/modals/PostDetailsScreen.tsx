/* eslint-disable react-hooks/rules-of-hooks */
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMachine, useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";
import { StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";

import { Right } from "../../assets/icons/Arrow";
import RoundTrip from "../../assets/icons/RoundTrip";
import { View, Text, Spacer, Button } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { RootStackParamList } from "../../types";
import { convertDate, convertTime } from "../../utils/convertPostTypes";
import { UserInfo } from "../../utils/userValidation";
import { useHeaderHeight } from "@react-navigation/elements";
import { copyToClipboard } from "../../utils/posts";
import { AuthContext, userIDSelector } from "../../utils/machines/authMachine";
import { multipleUserMachine } from "../../utils/machines/multipleUserMachine";
import SuccessfulPost from "../../components/shared/SuccessPage";
import { FBToPostSchema, PostType } from "../../utils/postValidation";
import { logError } from "../../utils/errorHandling";
import { getFunctions } from "../../utils/functions";

type Props = NativeStackScreenProps<RootStackParamList, "PostDetails">;
export default function DetailsModal({ route, navigation }: Props) {
    if (!route.params) return <></>;
    const serializedPost = route.params.post;
    const post = FBToPostSchema.parse(serializedPost);

    const [message, setMessage] = useState<string | null>(null);
    const [matchComplete, setMatchComplete] = useState(false);
    const authService = useContext(AuthContext);
    const userID = useSelector(authService, userIDSelector);

    const filled = post.riders ? Object.keys(post.riders).length + 1 : 1;

    const handleMatch = () => {
        Alert.alert("Confirm Match", "Are you sure you want to match with this post?", [
            {
                text: "Cancel",
            },
            {
                text: "Confirm",
                onPress: async () => {
                    try {
                        if (!userID) return;
                        if (!post) return;
                        if (post.riders && post.riders[userID] === true) return;
                        if (post.pending && post.pending[userID] === true) return;
                        const filled = post.riders ? Object.keys(post.riders).length + 1 : 1;
                        if (filled >= post.totalSpots) return;

                        const matchPost = getFunctions().httpsCallable("matchPost");
                        await matchPost({ userID, post });
                        setMatchComplete(true);
                        setTimeout(() => navigation.goBack(), 1000);
                    } catch (e: any) {
                        logError(e);
                        setMessage(e.message);
                    }
                },
            },
        ]);
    };

    return (
        // // <View>
        <View style={styles.infoContainer}>
            {matchComplete && <SuccessfulPost message="MATCH REQUESTED!" />}
            {!matchComplete && (
                <>
                    <ScrollView directionalLockEnabled style={styles.container}>
                        {message && (
                            <Text
                                textStyle="label"
                                style={{ color: Colors.red.p, textAlign: "center" }}>
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
                        <Button
                            title="Match!"
                            onPress={handleMatch}
                            color="purple"
                            disabled={filled >= post.totalSpots}
                        />
                        <Spacer direction="column" size={24} />
                    </View>
                </>
            )}
        </View>
    );
}

function MoreInfo({ post }: { post: PostType }) {
    const [state, send] = useMachine(multipleUserMachine);
    const { riders, error } = state.context;

    const pickup = post.pickup;
    const dropoff = post.dropoff;
    const date = convertDate(post.startTime);
    const startTime = convertTime(post.startTime);
    const endTime = convertTime(post.endTime);

    if (state.matches("Start")) {
        if (!post.riders) send("LOAD", { ids: [post.user] });
        else send("LOAD", { ids: Object.keys(post.riders).push(post.user) });
    }

    return (
        <View style={styles.infoContainer}>
            <Spacer direction="column" size={16} />
            <Text textStyle="header" styleSize="l">
                Ride Information
            </Text>
            <Spacer direction="column" size={16} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => copyToClipboard(post.pickup)}>
                    <Text textStyle="header" styleSize="s">
                        {pickup}
                    </Text>
                </TouchableOpacity>
                <Spacer direction="row" size={4} />

                {post.roundTrip ? (
                    <RoundTrip color={Colors.gray.b} height={20} />
                ) : (
                    <Right color={Colors.gray.b} height={20} />
                )}
            </View>
            <TouchableOpacity onPress={() => copyToClipboard(post.dropoff)}>
                <Text textStyle="header" styleSize="s">
                    {dropoff}
                </Text>
            </TouchableOpacity>
            <Spacer direction="column" size={16} />
            <Text textStyle="label" styleSize="l">
                {date}
            </Text>
            <Text textStyle="body" styleSize="s" style={{ color: Colors.purple.p }}>
                Pickup window: {startTime}-{endTime}
            </Text>
            <Text textStyle="body" styleSize="s" style={{ color: Colors.purple.p }}>
                {post.riders ? Object.keys(post.riders).length + 1 : 1}/{post.totalSpots} spots
                filled
            </Text>
            <Spacer direction="column" size={16} />
            <View style={{ flexDirection: "row" }}>
                {post.roundTrip ? (
                    <RoundTrip color={Colors.gray.b} height={20} />
                ) : (
                    <Right color={Colors.gray.b} height={20} />
                )}
                <Spacer direction="row" size={4} />
                <Text textStyle="lineTitle">{post.roundTrip ? "ROUND TRIP" : "ONE WAY"}</Text>
            </View>
            <Spacer direction="column" size={16} />
            <Text textStyle="label" styleSize="l">
                Notes:
            </Text>
            <Text textStyle="body" styleSize="s">
                {post.notes}
            </Text>
            <Spacer direction="column" size={48} />
            {riders && <UserList riders={riders} message={error ? error.message : ""} />}
        </View>
    );
}

function UserList({ riders, message }: { riders: UserInfo[]; message: string | null }) {
    let i = 1;
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
                            <UserDetails num={i++} user={match} />
                            <Spacer direction="column" size={32} />
                        </View>
                    );
                })}
        </View>
    );
}

function UserDetails({ user, num }: { user: UserInfo; num: number }) {
    return (
        <View>
            <Text textStyle="header">Rider {num}</Text>
            <Spacer direction="column" size={16} />

            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <Text textStyle="label" styleSize="l">
                        Major
                    </Text>
                    <Text textStyle="body" styleSize="s">
                        {user.major}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text textStyle="label" styleSize="l">
                        Grad Year
                    </Text>
                    <Text textStyle="body" styleSize="s">
                        {user.gradYear}
                    </Text>
                </View>
            </View>
            <Spacer direction="column" size={16} />

            <Text textStyle="label" styleSize="l">
                Pronouns
            </Text>
            <Text textStyle="body" styleSize="s">
                {user.pronouns}
            </Text>
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
