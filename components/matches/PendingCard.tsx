import { StyleSheet } from "react-native";

import { View, Text } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { convertLocation } from "../../utils/convertPostTypes";
import RoundTrip from "../../assets/icons/RoundTrip";
import { Right } from "../../assets/icons/Arrow";
import { Full } from "../../assets/icons/User";
import { useMachine } from "@xstate/react";
import { postInfoMachine } from "../../utils/machines/postInfoMachine";

export type Props = {
    postID: string;
};

export default function PendingCard({ postID }: Props) {
    const [state, send] = useMachine(postInfoMachine);
    if (state.matches("Start")) send("LOAD", { id: postID });
    const { post } = state.context;
    const color = Colors.purple.p;

    if (!post) return <></>;
    return (
        <View style={styles.cardContainer}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        paddingLeft: 16,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        opacity: 0.7,
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
