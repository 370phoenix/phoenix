import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, FlatList } from "react-native";

import { Right } from "../assets/icons/Arrow";
import RoundTrip from "../assets/icons/RoundTrip";
import { View, Text, Spacer, Button } from "../components/Themed";
import Colors from "../constants/Colors";
import { PostID, PostType } from "../constants/DataTypes";
import { convertDate, convertLocation, convertTime } from "../firebase/ConvertPostTypes";
import { MessageType, UserInfo, getUserOnce } from "../firebase/auth";
import { fetchPost } from "../firebase/fetchPosts";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "PostDetails">;
export default function DetailsModal({ route }: Props) {
    const [post, setPost] = useState<PostType | undefined | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [riders, setRiders] = useState<UserInfo[]>([]);

    useEffect(() => {
        // async function fetchRiders() {
        //     await post?.riders?.forEach(async (uid) => {
        //         const res = await getUserOnce(uid);
        //         if (res.type === MessageType.error) setMessage(res.message);
        //         if (res.type !== MessageType.success)
        //             throw Error(`Error fetching user data: ${res.message}`);
        //         const userInfo = res.data;
        
        //         if (!userInfo) throw new Error("Could not find user info.");
        //         riders.push(userInfo);
        //     });
        //     console.log(riders);
        //     setRiders(riders);
        // // };
        
        // fetchRiders();

        const getPostInfo = async (postID: PostID) => {
            const res = await fetchPost(postID);
            if (res.type === MessageType.error) setMessage(res.message);
            else setPost(res.data);
        };

        if (!route.params) return;
        const paramPost = route.params.post;
        if (paramPost instanceof Object && "postID" in paramPost) {
            setPost(paramPost);
        } else {
            getPostInfo(paramPost);
        }
    }, [route.params]);

    return (
        <ScrollView directionalLockEnabled style={styles.container}>
            {message && (
                <Text textStyle="label" style={{ color: Colors.red.p, textAlign: "center" }}>
                    {message}
                </Text>
            )}
            {post && <MoreInfo post={post} matches={riders} />}
        </ScrollView>
    );
}

function MoreInfo({ post, matches }: { post: PostType; matches: UserInfo[] }) {
    const [matched, setMatched] = useState(false);
    const onChangeMatched = () => setMatched(!matched);

    const pickup = convertLocation(post.pickup);
    const dropoff = convertLocation(post.dropoff);
    const date = convertDate(post.startTime);
    const startTime = convertTime(post.startTime);
    const endTime = convertTime(post.endTime);
    const riders = post.riders;

    return (
        <View style={styles.infoContainer}>
            <Spacer direction="column" size={16} />
            <Text textStyle="header" styleSize="l">
                Ride Information
            </Text>
            <Spacer direction="column" size={16} />
            <View style={{ flexDirection: "row" }}>
                <Text textStyle="header" styleSize="s">
                    {pickup}
                </Text>
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
            {riders ? (
                <Text textStyle="body" styleSize="s" style={{ color: Colors.purple.p }}>
                    {riders.length + 1}/{post.totalSpots} spots filled
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
                <Spacer direction="row" size={8} />
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
            <UserList matches={matches} />
            <Spacer direction="column" size={48} />
            <Button
                title={matched ? "Cancel Match" : "Match!"}
                onPress={onChangeMatched}
                color="purple"
            />
            <Spacer direction="column" size={800} />
        </View>
    );
}

function UserList({ matches }: { matches: UserInfo[] }) {
    return (<View style={{ marginTop: 20 }}>
    {typeof matches !== "string" && matches.length !== 0 && (
        <FlatList
            data={matches}
            style={{ paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <UserDetails user={item} />}
        />
    )}
</View>);
}

function UserDetails({user} : {user: UserInfo}) {
    return (
        <View>
            <Text textStyle="header">Rider Profile</Text>
            <Spacer direction="column" size={16} />
            <Text textStyle="label" styleSize="l">
                Major
            </Text>
            <Text textStyle="body" styleSize="s">
                {/* {userInfo.major} */}
            </Text>
            <Spacer direction="column" size={16} />
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <Text textStyle="label" styleSize="l">
                        Gender
                    </Text>
                    <Text textStyle="body" styleSize="s">
                        {/* {userInfo.gender} */}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text textStyle="label" styleSize="l">
                        Grad Year
                    </Text>
                    <Text textStyle="body" styleSize="s">
                        {/* {userInfo.gradYear} */}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        width: "100%",
    },
    container: {
        backgroundColor: Colors.gray[4],
    },
    infoContainer: {
        paddingHorizontal: 16,
    },
});
