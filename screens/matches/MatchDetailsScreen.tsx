import { StyleSheet, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { PostType } from "../../constants/DataTypes";
import { Text, View, Spacer, Button } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { RootStackParamList } from "../../types";
import { getUserOnce, MessageType, UserInfo } from "../../utils/auth";
import { convertDate, convertLocation, convertTime } from "../../utils/convertPostTypes";
import ProfileInfo from "../../components/profile/ProfileInfo";
import auth from "@react-native-firebase/auth";
import { MatchSublist } from "../../components/matches/MatchList";
import { useMachine } from "@xstate/react";
import { multipleUserMachine } from "../../utils/machines/multipleUserMachine";

type Props = NativeStackScreenProps<RootStackParamList, "MatchDetails">;
export default function MatchDetailsScreen({ route }: Props) {
    const currentUser = auth().currentUser?.uid;
    if (!currentUser || !route.params) return <></>;
    const { post, list } = route.params;
    const isMine = post.user == currentUser;
    const pending = list === MatchSublist.pending;

    const [state, send] = useMachine(multipleUserMachine);
    const { riders } = state.context;

    useEffect(() => {
        if (!state.matches("Start")) return;
        send("LOAD", { ids: post.riders ? [post.user, ...post.riders] : [post.user] });
    }, [send, state, post]);

    const onUnmatch = () => {
        // TODO
    };

    return (
        <ScrollView directionalLockEnabled style={styles.container}>
            <Text textStyle="header" style={styles.mb16}>
                Ride Information
            </Text>
            <Text textStyle="label">
                {convertLocation(post.pickup)} {"->"} {convertLocation(post.dropoff)}
            </Text>
            <Text>{convertDate(post.startTime)}</Text>
            <Text style={styles.mb16}>
                {convertTime(post.startTime)} - {convertTime(post.endTime)}
            </Text>
            <Text textStyle="label" style={styles.mb16}>
                {post.roundTrip ? "Round trip" : "One way"}
            </Text>
            <Text style={styles.mb16}>Notes: {post.notes}</Text>
            {riders && (
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
                riders.map((profile, index) => (
                    <View key={index}>
                        <ProfileInfo userInfo={profile} />
                    </View>
                ))}
            <Button title="Unmatch" onPress={onUnmatch} color="red" style={styles.button} />
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
