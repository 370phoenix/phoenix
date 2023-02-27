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
import RoundTrip from "../assets/icons/RoundTrip";
import { Right } from "../assets/icons/Arrow";
import { Full } from "../assets/icons/User";

export type Props = {
    postID: string;
    userInfo: UserInfo | null
};

export default function MatchCard({ postID, userInfo }: Props) {
    //const name = userID.username;
    //const [matches, setMatches] = useState([]);
    const [pickup, setPickup] = useState<string | null>(null);
    const [dropoff, setDropoff] = useState<string | null>(null);
    const [roundTrip, setTrip] = useState<boolean | null>(null);
    const [totalSpots, setTotalSpots] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [filledSpots, setFilledSpots] = useState<number | null>(null);

    useEffect(() => {
        loadInfo();
    }, [postID]);

    const loadInfo = async () => {
        //debugger;
        const res = await fetchPost(postID);
        if (res.type !== MessageType.success) {
            if (res.message == "Error: post missing or not found.") {
                // remove this ID from user info Posts or Matches (depending on where it is)
            }
            setMessage(res.message);
        }
        else if (!res.data) setMessage("No post data returned.")
        else {
            const post = res.data
            setPickup(convertLocation(post.pickup))
            setDropoff(convertLocation(post.dropoff))
            setTrip(post.roundTrip);
            setTotalSpots(post.totalSpots);
            if (post.riders == null) {
                setMessage("No rider data")
            }
            else {
                setFilledSpots(post.riders.length);
            }
        };
    }

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
                    <Text textStyle="label" styleSize="l" style={styles.name}>
                        {pickup}
                    </Text>
                </View>
                <View style={styles.bodyContainer} >
                    {roundTrip ? (
                        <RoundTrip color={Colors.purple.p} height={20} />
                    ) : (
                        <Right color={Colors.purple.p} height={20} />
                    )}
                    <Text textStyle="label" styleSize="l" style={styles.name}>
                        {dropoff}
                    </Text>

                </View>


                {message && <Text textStyle="label" style={styles.error}>{message}</Text>}
            </View>
            <View style={styles.riderIcon}>
                <Full color={Colors.purple.p} height={30} />
                <Text>
                    {filledSpots} / {totalSpots}
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
    bodyContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        borderLeftWidth: 1,
        height: "100%",
    },
    riderIcon: {
        flex: 1,
        alignItems: "flex-end",
        paddingRight: 16,
        justifyContent: "center",
    },
    textPart: { flex: 1, paddingVertical: 16 },
    error: {
        color: Colors.red.p
    }
});