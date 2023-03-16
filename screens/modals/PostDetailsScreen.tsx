import auth from "@react-native-firebase/auth";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";

import { Right } from "../../assets/icons/Arrow";
import RoundTrip from "../../assets/icons/RoundTrip";
import { View, Text, Spacer, Button } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { PostType } from "../../constants/DataTypes";
import { RootStackParamList } from "../../types";
import { MessageType, UserInfo, getUserOnce } from "../../utils/auth";
import { convertDate, convertLocation, convertTime } from "../../utils/convertPostTypes";
import { matchPost, deletePost } from "../../utils/posts";

type Props = NativeStackScreenProps<RootStackParamList, "PostDetails">;
export default function DetailsModal({ route }: Props) {
    if (!route.params) return <></>;
    const post = route.params.post;

    const [message, setMessage] = useState<string | null>(null);

    const currentUser = auth().currentUser?.uid;
    let isMatched;
    if (!currentUser) isMatched = false;
    else isMatched = post.riders?.includes(currentUser) || post.pending?.includes(currentUser);
    const [matched, setMatched] = useState(isMatched);

    const handleMatch = () => {
        Alert.alert("Confirm Match", "Are you sure you want to match with this post?", [
            {
                text: "Cancel",
            },
            {
                text: "Confirm",
                onPress: async () => {
                    if (!currentUser) return;
                    if (!post) return;
                    if (post.riders?.includes(currentUser)) return;
                    if (post.pending?.includes(currentUser)) return;

                    const res = await matchPost(currentUser, post);
                    if (res.type === MessageType.error) setMessage(res.message);
                    else setMatched(true);
                },
            },
        ]);
    };

    const handleDelete = () => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this post?", [
            {
                text: "Confirm",
                onPress: async () => {
                    try {
                        if (!currentUser) throw Error("Error in fetching user");
                        const res = await getUserOnce(currentUser);
                        if (res.type !== MessageType.success) throw new Error(res.message);
                        const userInfo = res.data;
                        const [userID, userObj] = [currentUser, userInfo];
                        if (userID && userObj) await deletePost(post.postID, userID, userObj);
                        return { type: MessageType.success, data: undefined };
                    } catch (e: any) {
                        return { type: MessageType.error, message: `Error: ${e.message}` };
                    }
                },
            },
            {
                text: "Cancel",
            },
        ]);
    };

    const headerHeight = useHeaderHeight();

    const MatchButton = <Button title={"Match!"} onPress={handleMatch} color="purple" />;
    const UnmatchButton = <Button title={"Cancel Request"} onPress={handleMatch} color="red" />;
    const DeleteButton = <Button title="Delete Post" onPress={handleDelete} color="red" />;

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
                    height: headerHeight + 16,
                    padding: 16,
                }}>
                {currentUser !== post.user && matched ? UnmatchButton : MatchButton}
                {currentUser === post.user && DeleteButton}
                <Spacer direction="column" size={24} />
            </View>
        </View>
    );
}

function MoreInfo({ post }: { post: PostType }) {
    const [riders, setRiders] = useState<UserInfo[] | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const pickup = convertLocation(post.pickup);
    const dropoff = convertLocation(post.dropoff);
    const date = convertDate(post.startTime);
    const startTime = convertTime(post.startTime);
    const endTime = convertTime(post.endTime);

    useEffect(() => {
        async function fetchRiders() {
            const ids = post.riders ? post.riders : [];
            if (!ids.includes(post.user)) ids.push(post.user);
            if (riders) return;
            if (!ids) return;

            const ridersInfo: UserInfo[] = [];
            for (const id of ids) {
                const res = await getUserOnce(id);
                if (res.type !== MessageType.success) {
                    setMessage(res.message);
                    return;
                }

                const userInfo = res.data;
                if (!userInfo) throw new Error("Could not find user info.");

                ridersInfo.push(userInfo);
            }

            setRiders(ridersInfo);
        }
        fetchRiders();
    }, [post, riders, setRiders, setMessage]);

    return (
        <View style={styles.infoContainer}>
            <Spacer direction="column" size={16} />
            <Text textStyle="header" styleSize="l">
                Ride Information
            </Text>
            <Spacer direction="column" size={16} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text textStyle="header" styleSize="s">
                    {pickup}
                </Text>
                <Spacer direction="row" size={4} />

                {post.roundTrip ? (
                    <RoundTrip color={Colors.gray.b} height={20} />
                ) : (
                    <Right color={Colors.gray.b} height={20} />
                )}
            </View>
            <Text textStyle="header" styleSize="s">
                {dropoff}
            </Text>
            <Spacer direction="column" size={16} />
            <Text textStyle="label" styleSize="l">
                {date}
            </Text>
            <Text textStyle="body" styleSize="s" style={{ color: Colors.purple.p }}>
                Pickup window: {startTime}-{endTime}
            </Text>
            {post.riders ? (
                <Text textStyle="body" styleSize="s" style={{ color: Colors.purple.p }}>
                    {post.riders.filter((val) => val != null).length}/{post.totalSpots} spots filled
                </Text>
            ) : (
                <></>
            )}
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
            {riders && <UserList riders={riders} message={message} />}
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
                Gender
            </Text>
            <Text textStyle="body" styleSize="s">
                {user.gender}
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
