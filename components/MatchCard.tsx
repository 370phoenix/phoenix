import { StyleSheet, Pressable, Platform, Alert } from "react-native";

import { View, Text, Spacer } from "./Themed";
import Colors from "../constants/Colors";
import { Button } from "./Themed";
import { useEffect, useState } from "react";
import { getUserOnce, MessageType, UserInfo, writeUser } from "../firebase/auth";
import Accept from "../assets/icons/Accept";
import Reject from "../assets/icons/Reject";
import { PostID, UserID, PostType, Coords } from "../constants/DataTypes";
import { handleAcceptReject, writePostData } from "../firebase/makePosts";
import { fetchPost } from "../firebase/fetchPosts";
import { fetchSomePosts } from "../firebase/posts";
import { convertLocation } from "../firebase/ConvertPostTypes";

export type Props = {
    postID: string;
    post: PostType;
};

export default function MatchCard({ postID }: Props) {
    //const name = userID.username;
    //const [matches, setMatches] = useState([]);
    const [pickup, setPickup] = useState<string | Coords>("");
    const [dropoff, setDropoff] = useState<string | Coords>("");
    const [roundTrip, setTrip] = useState<boolean | null>(null);
    const [totalSpots, setTotalSpots] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    //const pickup = post.pickup;

    useEffect(() => {
        loadInfo();
    }, [postID]);

    const loadInfo = async () => {
        const res = await fetchSomePosts([postID]);
        if (res.type !== MessageType.success) setMessage(res.message);
        else {
            const postInfo = res.data;
            postInfo?.forEach((post) => {
                if (
                    !post.pickup ||
                    !post.dropoff ||
                    !post.totalSpots ||
                    !post.roundTrip
                ) {
                    setMessage("Couldn't find post information.");
                    return;
                }
                setPickup(post.pickup);
                setDropoff(post.dropoff);
                setTrip(post.roundTrip);
                setTotalSpots(post.totalSpots);
            }
            )
        };



        return (
            <Pressable
                style={({ pressed }) => [
                    styles.cardContainer,
                    {
                        backgroundColor: pressed ? Colors.gray[3] : Colors.gray[4],
                    },
                ]}>
                <View style={styles.textPart}>
                    <View style={styles.headerContainer}>
                        <Text textStyle="header" styleSize="m" style={styles.name}>
                            {pickup}
                        </Text>
                        <Text textStyle="label" style={styles.subtext}>
                            {dropoff}
                        </Text>
                    </View>

                    <Text textStyle="body" styleSize="m">
                        {roundTrip} {totalSpots}
                    </Text>
                </View>
            </Pressable>
        );
    }

    const styles = StyleSheet.create({
        cardContainer: {
            marginBottom: 16,
            paddingLeft: 16,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderTopWidth: 1,
        },
        body: { flex: 1 },
        riderIndicator: { justifyContent: "center", alignItems: "center", height: 25 },
        name: {
            color: Colors.purple.p,
            marginRight: 8,
        },
        subtext: {
            color: Colors.gray[2],
        },
        headerContainer: {
            flexDirection: "row",
            alignItems: "baseline",
        },
        button: {
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 16,
            borderLeftWidth: 1,
            height: "100%",
        },
        textPart: { flex: 1, paddingVertical: 16 },
    });

