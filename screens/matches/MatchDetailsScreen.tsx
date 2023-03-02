import { StyleSheet, ScrollView, Alert } from "react-native";
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
import { unmatchPost } from "../../utils/posts";

type Props = NativeStackScreenProps<RootStackParamList, "MatchDetails">;
export default function MatchDetailsScreen({ route }: Props) {
    const currentUser = auth().currentUser?.uid;
    if (!currentUser || !route.params) return <></>;
    const { post, list } = route.params;
    const isMine = post.user == currentUser;
    const pending = list === MatchSublist.pending;

    const [posterInfo, setPosterInfo] = useState<UserInfo | null>(null);
    const [profiles, setProfiles] = useState<UserInfo[] | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadPoster = async () => {
            const res = await getUserOnce(post.user);
            if (res.type === MessageType.success) setPosterInfo(res.data);
            else console.log(res.message);
        };
        const loadUsers = async () => {
            const objects = [];
            if (post.riders) {
                for (const rider of post.riders) {
                    const res = await getUserOnce(rider);
                    if (res.type === MessageType.success) objects.push(res.data);
                    else {
                        console.log(res.message);
                    }
                }
            }

            setProfiles(objects);
        };

        if (!pending) loadUsers();
        if (!pending && !isMine) loadPoster();
    }, [post, isMine, pending]);

    const onUnmatch = async () => {
        Alert.alert("Confirm Unmatch", "Are you sure you want to unmatch with this post?", [
            {
                text: "Cancel",
            },
            {
                text: "Confirm",
                onPress: async () => {
                    if (!currentUser) return;
                    if (!post) return;
                    if (!post.riders?.includes(currentUser)) return;

                    const res = await unmatchPost(currentUser, post);
                    if (res.type === MessageType.error) setMessage(res.message);
                },
            },
        ]);
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
            {posterInfo && (
                <>
                    <Text textStyle="header" style={styles.mb8}>
                        Coordinator Profile
                    </Text>
                    <ProfileInfo userInfo={posterInfo} />
                    <Spacer direction="column" size={16} />
                </>
            )}
            <Text textStyle="header" style={styles.mb8}>
                Rider Profiles
            </Text>
            {!pending &&
                profiles &&
                profiles.map((profile, index) => (
                    <View key={index}>
                        <ProfileInfo userInfo={profile} />
                    </View>
                ))}
            {message && <Text>{message}</Text>}
            {currentUser !== post.user && <Button title="Unmatch" onPress={onUnmatch} color="red" style={styles.button} />}
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
