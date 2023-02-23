import { StyleSheet, Pressable, Platform, Alert } from "react-native";

import { View, Text, Spacer, Button } from "./Themed";
import Colors from "../constants/Colors";
import { PostType, UserID } from "../constants/DataTypes";
import { convertDate, convertLocation, convertTime } from "../firebase/ConvertPostTypes";
import { useNavigation } from "@react-navigation/native";
import { Right } from "../assets/icons/Arrow";
import { Full, Outline } from "../assets/icons/User";
import RoundTrip from "../assets/icons/RoundTrip";
import Trash from "../assets/icons/Trash";
import { deletePost } from "../firebase/posts";
import { UserInfo } from "../firebase/auth";

type Props = {
    isProfile?: boolean;
    userInfo?: [UserID | null, UserInfo | null];
    post: PostType;
};
export default function PostCard({ post, isProfile = false, userInfo = [null, null] }: Props) {
    const navigation = useNavigation();
    const pickup = convertLocation(post.pickup);
    const dropoff = convertLocation(post.dropoff);
    const fDate = convertDate(post.startTime);
    const fStartTime = convertTime(post.startTime);
    const fEndTime = convertTime(post.endTime);

    return (
        <Pressable
            onPress={() => navigation.navigate("PostDetails", { post: post })}
            style={({ pressed }) => [
                styles.cardContainer,
                {
                    backgroundColor: pressed ? Colors.gray[4] : Colors.gray.w,
                    marginHorizontal: isProfile ? 0 : 16,
                    flexDirection: isProfile ? "column" : "row",
                },
            ]}
            key={post.postID}>
            <View style={styles.body}>
                <Text textStyle="header" styleSize="s" style={styles.text}>
                    {pickup}
                </Text>
                <View style={styles.headerContainer}>
                    {post.roundTrip ? (
                        <RoundTrip color={Colors.purple.p} height={20} />
                    ) : (
                        <Right color={Colors.purple.p} height={20} />
                    )}
                    <Text textStyle="header" styleSize="s" style={styles.text}>
                        {dropoff}
                    </Text>
                </View>
                <Spacer direction="column" size={16} />

                <Text textStyle="label" style={styles.text}>
                    {fDate}
                </Text>
                {!isProfile && (
                    <Text textStyle="body" styleSize="s" style={styles.text}>
                        {fStartTime} - {fEndTime}
                    </Text>
                )}
            </View>
            <Spacer direction={isProfile ? "column" : "row"} size={16} />
            <RiderBadge post={post} isProfile={isProfile} userInfo={userInfo} />
        </Pressable>
    );
}

type BadgeProps = {
    post: PostType;
    isProfile: boolean;
    userInfo: [UserID | null, UserInfo | null];
};
function RiderBadge({ post, isProfile, userInfo }: BadgeProps) {
    const total = post.totalSpots;
    const filled =
        (post.riders ? post.riders.length : 0) + (post.pending ? post.pending.length : 0) + 1;
    let rows = new Array<Array<number>>(isProfile ? 1 : total > 4 ? 2 : 1);
    if (!isProfile) {
        rows[0] = new Array(total > 4 ? 4 : total);
        rows[0].fill(0);

        if (filled >= 4) rows[0].fill(1);
        else rows[0].fill(1, 0, filled);

        if (rows.length === 2) {
            const temp = rows[0];
            rows[0] = new Array(total - 4);
            rows[0].fill(0);
            if (filled - 4 > 0) rows[0].fill(1, 0, filled - 4);
            rows[1] = temp;
        }
    } else {
        rows[0] = new Array(total);
        rows[0].fill(0);
        rows[0].fill(1, 0, filled);
    }

    const handleDelete = () => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this post?", [
            {
                text: "Confirm",
                onPress: async () => {
                    const [userID, userObj] = userInfo;
                    if (userID && userObj) await deletePost(post.postID, userID, userObj);
                },
            },
            {
                text: "Cancel",
            },
        ]);
    };

    return (
        <>
            {rows.map((row, index) => (
                <View
                    style={isProfile ? styles.riderBadgeProfile : styles.riderBadge}
                    key={`row-${index}`}>
                    {row.map((rider, index) => (
                        <View style={styles.riderIndicator} key={Math.random()}>
                            {rider === 1 ? (
                                <Full color={Colors.purple.p} height={20} />
                            ) : (
                                <Outline color={Colors.purple.p} height={20} />
                            )}
                        </View>
                    ))}

                    {isProfile && (
                        <>
                            <View style={{ flex: 1 }} />
                            <Pressable
                                onPress={handleDelete}
                                style={({ pressed }) => [
                                    styles.trash,
                                    {
                                        backgroundColor: pressed
                                            ? Colors.purple.m
                                            : Colors.purple.p,
                                    },
                                ]}>
                                <Trash color={Colors.gray.w} width={16} />
                            </Pressable>
                        </>
                    )}
                </View>
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        shadowColor: Platform.OS === "ios" ? Colors.purple.p : undefined,
        shadowOpacity: 0.5,
        elevation: 10,
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowRadius: 4,
    },
    body: { flex: 1, width: "100%" },
    riderIndicator: { justifyContent: "center", alignItems: "center", height: 25 },
    text: {
        color: Colors.purple.p,
    },
    riderBadge: { height: 100, flexDirection: "column", justifyContent: "center" },
    riderBadgeProfile: {
        marginTop: -12,
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
    },
    headerContainer: {
        marginLeft: -4,
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
    },
    trash: {
        borderRadius: 4,
        height: 40,
        width: 40,
        justifyContent: "center",
        alignItems: "center",
    },
});
