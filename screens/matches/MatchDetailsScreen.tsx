/* eslint-disable react-hooks/rules-of-hooks */
import { StyleSheet, ScrollView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View, Spacer, Button } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { RootStackParamList } from "../../types";
import { convertDate, convertTime } from "../../utils/convertPostTypes";
import ProfileInfo from "../../components/profile/ProfileInfo";
import auth from "@react-native-firebase/auth";
import { MatchSublist } from "../../components/matches/MatchList";
import { useMachine } from "@xstate/react";
import { multipleUserMachine } from "../../utils/machines/multipleUserMachine";
import { useState } from "react";
import { cancelPendingMatch, unmatchPost } from "../../utils/posts";
import { MessageType } from "../../utils/auth";
import { cancel } from "xstate/lib/actionTypes";

type Props = NativeStackScreenProps<RootStackParamList, "MatchDetails">;
export default function MatchDetailsScreen({ route, navigation }: Props) {
    const [unmatchComplete, setUnmatchComplete] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    
    const userID = auth().currentUser?.uid;
    if (!userID || !route.params) return <></>;
    const { post, list } = route.params;
    const isMine = post ? post.user === userID : false;
    const pending = list === MatchSublist.pending;

    const [state, send] = useMachine(multipleUserMachine);
    const { riders } = state.context;

    if (state.matches("Start"))
        send("LOAD", { ids: post.riders ? [post.user, ...post.riders] : [post.user] });

    const onUnmatch = () => {
        Alert.alert("Confirm Unmatch", "Are you sure you want to unmatch with this post?", [
            {
                text: "Cancel",
            },
            {
                text: "Confirm",
                onPress: async () => {
                    if (!userID) return;
                    if (!post) return;
                    if (!post.riders?.includes(userID)) return;
                    
                    const res = await unmatchPost(userID, post);
                    if (res.type === MessageType.error) setMessage(res.message);
                    else {
                        setUnmatchComplete(true);
                        navigation.goBack();
                        // TODO: Send notification to alert all matched riders of unmatch
                    }
                },
            },
        ]);
    };

    const onCancel = () => {
        Alert.alert("Confirm Cancel", "Are you sure you want to cancel your match request?", [
            {
                text: "Cancel",
            },
            {
                text: "Confirm",
                onPress: async () => {
                    if (!userID) return;
                    if (!post) return;
                    if (!post.pending?.includes(userID)) return;
                    
                    const res = await cancelPendingMatch(userID, post);
                    if (res.type === MessageType.error) setMessage(res.message);
                    else {
                        setUnmatchComplete(true);
                        navigation.goBack();
                        // TODO: Send notification to alert poster of canceled request
                    }
                },
            },
        ]);
    };

    const unmatchButton = <Button title="Unmatch" onPress={onUnmatch} color="red" style={styles.button} />;
    const cancelButton = <Button title="Cancel Request" onPress={onCancel} color="red" style={styles.button} />;

    return (
        <ScrollView directionalLockEnabled style={styles.container}>
            <Text textStyle="header" style={styles.mb16}>
                Ride Information
            </Text>
            <Text textStyle="label">
                {post.pickup} {"->"} {post.dropoff}
            </Text>
            <Text>{convertDate(post.startTime)}</Text>
            <Text style={styles.mb16}>
                {convertTime(post.startTime)} - {convertTime(post.endTime)}
            </Text>
            <Text textStyle="label" style={styles.mb16}>
                {post.roundTrip ? "Round trip" : "One way"}
            </Text>
            <Text style={styles.mb16}>Notes: {post.notes}</Text>
            {!pending && riders.length > 0 && (
                <>
                    <Text textStyle="header" style={styles.mb8}>
                        Coordinator Profile
                    </Text>
                    <ProfileInfo userInfo={riders[0]} />
                    <Spacer direction="column" size={16} />
                </>
            )}
            <Text textStyle="header" style={styles.mb8}>
                Rider Profiles
            </Text>
            {!pending &&
                riders &&
                riders.slice(1).map((profile, index) => (
                    <View key={index}>
                        <ProfileInfo userInfo={profile} />
                    </View>
                ))}
            {!isMine && (pending ? cancelButton : unmatchButton)}
            <Spacer direction="column" size={200} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.gray[4],
        marginTop: -20,
        paddingTop: 52,
        paddingHorizontal: 16,
    },
    mb8: {
        marginBottom: 8,
    },
    mb16: {
        marginBottom: 16,
    },
    button: { marginTop: 40 },
});
