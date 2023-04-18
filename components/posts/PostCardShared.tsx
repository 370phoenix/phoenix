import { Alert, Pressable, View, StyleSheet } from "react-native";
import functions from "@react-native-firebase/functions";

import Colors from "../../constants/Colors";
import { Spacer, Text } from "../shared/Themed";
import { UserInfo } from "../../utils/auth";
import { convertDate, convertTime } from "../../utils/convertPostTypes";
import { PostType } from "../../utils/postValidation";
import RoundTrip from "../../assets/icons/RoundTrip";
import { Right } from "../../assets/icons/Arrow";
import Trash from "../../assets/icons/Trash";
import { Full, Outline } from "../../assets/icons/User";

interface PostCardGutsProps {
    post: PostType;
    isProfile: boolean;
    isMatched: boolean;
    userInfo: UserInfo;
}
export function PostCardGuts({ post, isProfile, isMatched, userInfo }: PostCardGutsProps) {
    const pickup = post.pickup;
    const dropoff = post.dropoff;
    const fDate = convertDate(new Date(post.startTime));
    const fStartTime = convertTime(new Date(post.startTime));
    const fEndTime = convertTime(new Date(post.endTime));

    const color = isProfile ? Colors.navy : Colors.purple;

    return (
        <>
            <View style={styles.body}>
                <Text textStyle="header" styleSize="s" style={{ color: color.p }}>
                    {pickup}
                </Text>
                <View style={styles.headerContainer}>
                    {post.roundTrip ? (
                        <RoundTrip color={color.p} height={20} />
                    ) : (
                        <Right color={color.p} height={20} />
                    )}
                    <Text textStyle="header" styleSize="s" style={{ color: color.p }}>
                        {dropoff}
                    </Text>
                </View>
                <Spacer direction="column" size={16} />

                <Text textStyle="label" style={{ color: color.p }}>
                    {fDate}
                </Text>
                {!isProfile && (
                    <Text textStyle="body" styleSize="s" style={{ color: color.p }}>
                        {fStartTime} - {fEndTime}
                    </Text>
                )}
            </View>
            <Spacer direction={isProfile ? "column" : "row"} size={16} />
            <RiderBadge
                post={post}
                isProfile={isProfile}
                userInfo={userInfo}
                isMatched={isMatched}
            />
        </>
    );
}

type BadgeProps = {
    post: PostType;
    isProfile: boolean;
    isMatched: boolean;
    userInfo: UserInfo;
};
function RiderBadge({ post, isProfile, userInfo, isMatched }: BadgeProps) {
    const total = post.totalSpots;
    const postRiders = post.riders ? post.riders.filter((val) => val != null) : [];
    const filled = postRiders.length + 1;
    const pending = post.pending ? post.pending.length : 0;
    const riders = Array<number>(total);
    const rows = Array<Array<number>>(isProfile ? 1 : total > 4 ? 2 : 1);

    const color = isProfile ? Colors.navy : Colors.purple;

    riders.fill(0);
    if (isMatched && !isProfile) {
        riders.fill(2, 0, filled - 1);
        riders[filled - 1] = 3;
    } else riders.fill(2, 0, filled);
    riders.fill(1, filled, filled + pending);

    if (!isProfile) {
        if (rows.length > 1) {
            const first = riders.slice(0, 4);
            const last = riders.slice(4, riders.length);
            rows[0] = last;
            rows[1] = first;
        } else {
            rows[0] = riders;
        }
    } else {
        rows[0] = riders;
    }

    const handleDelete = () => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this post?", [
            {
                text: "Confirm",
                onPress: async () => {
                    const { userID } = userInfo;
                    if (userID) {
                        const fullPostDelete = functions().httpsCallable("fullPostDelete");
                        fullPostDelete({
                            postID: post.postID,
                        })
                            .then(() => {
                                console.log("Post Deleted");
                            })
                            .catch((e) => {
                                console.error(e);
                            });
                    }
                },
            },
            {
                text: "Cancel",
            },
        ]);
    };

    return (
        <>
            {rows.map((row, index_1) => (
                <View
                    style={isProfile ? styles.riderBadgeProfile : styles.riderBadge}
                    key={`row-${index_1}`}>
                    {row.map((rider) => (
                        <View style={styles.riderIndicator} key={Math.random()}>
                            {rider > 0 ? (
                                rider === 3 ? (
                                    <Full color={color[1]} height={20} />
                                ) : (
                                    <Full color={rider === 1 ? color.m : color.p} height={20} />
                                )
                            ) : (
                                <Outline color={color.p} height={20} />
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
                                        backgroundColor: pressed ? Colors.red[3] : Colors.gray.w,
                                    },
                                ]}>
                                <Trash color={Colors.red.p} width={20} />
                            </Pressable>
                        </>
                    )}
                </View>
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    body: { flex: 1, width: "100%" },
    riderIndicator: { justifyContent: "center", alignItems: "center", height: 25 },
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
        borderRadius: 8,
        padding: 8,
        marginBottom: -8,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {},
});
