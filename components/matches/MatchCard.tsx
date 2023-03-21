import { StyleSheet, Pressable } from "react-native";

import { View, Text } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { useEffect, useState } from "react";
import { MessageType, UserInfo } from "../../utils/auth";
import { PostType } from "../../constants/DataTypes";
import { fetchPost } from "../../utils/posts";
import { convertLocation } from "../../utils/convertPostTypes";
import RoundTrip from "../../assets/icons/RoundTrip";
import { Right } from "../../assets/icons/Arrow";
import { Full } from "../../assets/icons/User";
import { useNavigation } from "@react-navigation/native";
<<<<<<< HEAD
=======
import { MatchSublist } from "./MatchList";
>>>>>>> main

export type Props = {
    postID: string;
    userInfo: UserInfo | null;
<<<<<<< HEAD
};

export default function MatchCard({ postID }: Props) {
=======
    list: MatchSublist;
};

export default function MatchCard({ postID, list }: Props) {
>>>>>>> main
    const navigation = useNavigation();

    const [post, setPost] = useState<PostType | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        loadInfo();
    }, [postID]);

    const loadInfo = async () => {
        const res = await fetchPost(postID);
        if (res.type !== MessageType.success) {
            if (res.message == "Error: post missing or not found.") {
                // remove this ID from user info Posts or Matches (depending on where it is)
            }
            setMessage(res.message);
        } else if (!res.data) setMessage("No post data returned.");
        else {
            setPost(res.data);
        }
    };

    if (!post) return <View />;

    return (
        <Pressable
<<<<<<< HEAD
            onPress={() => navigation.navigate("MatchDetails", { post: post })} //pass the post info
=======
            onPress={() => navigation.navigate("MatchDetails", { post: post, list: list })} //pass the post info
>>>>>>> main
            style={({ pressed }) => [
                styles.cardContainer,
                {
                    backgroundColor: pressed ? Colors.gray[4] : Colors.gray.w,
                },
            ]}>
            <View style={styles.textPart}>
                <View style={styles.headerContainer}>
                    <Text textStyle="label" styleSize="l" style={styles.name}>
                        {convertLocation(post.pickup)}
                    </Text>
                </View>
                <View style={styles.bodyContainer}>
                    {post.roundTrip ? (
                        <RoundTrip color={Colors.purple.p} height={20} />
                    ) : (
                        <Right color={Colors.purple.p} height={20} />
                    )}
                    <Text textStyle="label" styleSize="l" style={styles.name}>
                        {convertLocation(post.dropoff)}
                    </Text>
                </View>

                {message && (
                    <Text textStyle="label" style={styles.error}>
                        {message}
                    </Text>
                )}
            </View>
            <View style={styles.riderIcon}>
                <Full color={Colors.purple.p} height={28} />
                <Text>
<<<<<<< HEAD
                    {post.riders ? post.riders.length + 1 : 1} / {post.totalSpots}
=======
                    {post.riders ? post.riders.filter((val) => val != null).length + 1 : 1} /{" "}
                    {post.totalSpots}
>>>>>>> main
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        paddingLeft: 16,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
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
    textPart: { flex: 1 },
    error: {
        color: Colors.red.p,
    },
});
