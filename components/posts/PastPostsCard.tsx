import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, Pressable, Platform, Alert } from "react-native";

import { View, Text, Spacer } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { convertDate, convertLocation } from "../../utils/convertPostTypes";
import RoundTrip from "../../assets/icons/RoundTrip";
import { Right } from "../../assets/icons/Arrow";
import { Full } from "../../assets/icons/User";
import { MatchSublist } from "../matches/MatchList";
import { useMachine } from "@xstate/react";
import { postInfoMachine } from "../../utils/machines/postInfoMachine";
import { UserID } from "../../constants/DataTypes";

export type Props = {
    postID: string;
    userID: UserID;
};

export default function PastPostsCard({ postID, userID }: Props) {
    const navigation = useNavigation();
    const [state, send] = useMachine(postInfoMachine);
    const { post } = state.context;
    const isMine = post ? post.user === userID : false;
    const color = isMine ? Colors.navy.p : Colors.purple.p;

    //const pickup = convertLocation(post.pickup);

    if (state.matches("Start")) send("LOAD", { id: postID });

    if (!post) return <View />;

    return (
        <Pressable
            onPress={() => navigation.navigate("PostDetails", { post })} //need to switch this to PastPostDetails
            style={({ pressed }) => [
                styles.cardContainer,
                {
                    backgroundColor: pressed ? Colors.gray[4] : Colors.gray.w,
                    marginHorizontal: 16,
                    flexDirection: "row",
                },
            ]}>
            <View style={styles.body}>
                <Text textStyle="header" styleSize="s" style={{ color: Colors.purple.p }}>
                    {convertLocation(post.pickup)}
                </Text>
                <View style={styles.headerContainer}>
                    {post.roundTrip ? (
                        <RoundTrip color={Colors.purple.p} height={20} />
                    ) : (
                        <Right color={Colors.purple.p} height={20} />
                    )}
                    <Text textStyle="header" styleSize="s" style={{ color: Colors.purple.p }}>
                        {convertLocation(post.dropoff)}
                    </Text>
                </View>
                <Spacer direction="column" size={16} />

                <Text textStyle="label" style={{ color: Colors.purple.p }}>
                    {convertDate(post.startTime)}
                </Text>
                {/* {!isProfile && (
                    <Text textStyle="body" styleSize="s" style={{ color: color.p }}>
                        {fStartTime} - {fEndTime}
                    </Text>
                )} */}
            </View>
            {/* <Spacer direction={isProfile ? "column" : "row"} size={16} />
            <RiderBadge
                post={post}
                isProfile={isProfile}
                userInfo={userInfo}
                isMatched={isMatched ? isMatched : false}
            /> */}
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
        borderRadius: 8,
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
