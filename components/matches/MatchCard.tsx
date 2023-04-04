import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Pressable } from "react-native";

import { View, Text } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { convertLocation } from "../../utils/convertPostTypes";
import RoundTrip from "../../assets/icons/RoundTrip";
import { Right } from "../../assets/icons/Arrow";
import { Full } from "../../assets/icons/User";
import { MatchSublist } from "./MatchList";
import { useMachine } from "@xstate/react";
import { postInfoMachine } from "../../utils/machines/postInfoMachine";
import { UserID, PostType } from "../../constants/DataTypes";

export type Props = {
    post?: PostType | null;
    postID?: string | null;
    list: MatchSublist;
    userID: UserID;
};

export default function MatchCard({ postID = null, list, userID, post = null }: Props) {
    const navigation = useNavigation();
    if (!post) {
        const [state, send] = useMachine(postInfoMachine);
        post = state.context.post;
        if (state.matches("Start")) send("LOAD", { id: postID });
    }
    const isMine = post ? post.user === userID : false;
    const color = isMine ? Colors.navy.p : Colors.purple.p;

    if (!post) return <View />;

    return (
        <Pressable
            onPress={() => navigation.navigate("MatchDetails", { post: post!, list: list })} // Okay to override with ! because of early return
            style={({ pressed }) => [
                styles.cardContainer,
                {
                    backgroundColor: pressed ? Colors.gray[4] : Colors.gray.w,
                },
            ]}>
            <View style={styles.textPart}>
                <View style={styles.headerContainer}>
                    <Text textStyle="label" styleSize="l" style={[styles.name, { color }]}>
                        {convertLocation(post.pickup)}
                    </Text>
                </View>
                <View style={styles.bodyContainer}>
                    {post.roundTrip ? (
                        <RoundTrip color={color} height={20} />
                    ) : (
                        <Right color={color} height={20} />
                    )}
                    <Text textStyle="label" styleSize="l" style={[styles.name, { color }]}>
                        {convertLocation(post.dropoff)}
                    </Text>
                </View>
            </View>
            <View style={styles.riderIcon}>
                <View style={styles.riderGroup}>
                    <Full color={color} height={28} />
                    <Text style={{ color: color }}>
                        {post.riders ? post.riders.filter((val) => val != null).length + 1 : 1} /{" "}
                        {post.totalSpots}
                    </Text>
                </View>
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
    riderGroup: {
        alignItems: "center",
        justifyContent: "center",
    },
});
