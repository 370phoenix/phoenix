import { StyleSheet, Pressable } from "react-native";

import { View, Text } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { useEffect } from "react";
import { UserInfo } from "../../utils/auth";
import { convertLocation } from "../../utils/convertPostTypes";
import RoundTrip from "../../assets/icons/RoundTrip";
import { Right } from "../../assets/icons/Arrow";
import { Full } from "../../assets/icons/User";
import { useNavigation } from "@react-navigation/native";
import { MatchSublist } from "./MatchList";
import { useMachine } from "@xstate/react";
import { postInfoMachine } from "../../utils/machines/postInfoMachine";

export type Props = {
    postID: string;
    userInfo: UserInfo | null;
    list: MatchSublist;
};

export default function MatchCard({ postID, list }: Props) {
    const navigation = useNavigation();
    const [state, send] = useMachine(postInfoMachine);
    const { post } = state.context;

    useEffect(() => {
        if (!state.matches("Start")) return;
        send("LOAD", { id: postID });
    }, [state, send, postID]);

    if (!post) return <View />;
    console.log(post);

    return (
        <Pressable
            onPress={() => navigation.navigate("MatchDetails", { post: post, list: list })} //pass the post info
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
            </View>
            <View style={styles.riderIcon}>
                <Full color={Colors.purple.p} height={28} />
                <Text>
                    {post.riders ? post.riders.filter((val) => val != null).length + 1 : 1} /{" "}
                    {post.totalSpots}
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
