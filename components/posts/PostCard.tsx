import { StyleSheet, Pressable, Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Right } from "../../assets/icons/Chevron";
import RoundTrip from "../../assets/icons/RoundTrip";
import Trash from "../../assets/icons/Trash";
import { Full, Outline } from "../../assets/icons/User";
import { UserID, PostType } from "../../constants/DataTypes";
import Colors from "../../constants/Colors";
import { convertLocation, convertDate, convertTime } from "../../utils/convertPostTypes";
import { deletePost } from "../../utils/posts";
import { Spacer, Text, View } from "../shared/Themed";
import { UserInfo } from "../../utils/auth";
import { useSelector } from "@xstate/react";
import { useContext } from "react";
import { AuthContext, userIDSelector, userInfoSelector } from "../../utils/machines/authMachine";
import { MatchSublist } from "../matches/MatchList";

type Props = {
    isProfile?: boolean;
    userInfo?: [UserID | null, UserInfo | null];
    post: PostType;
};
export default function PostCard({ post, isProfile = false, userInfo = [null, null] }: Props) {
    const authService = useContext(AuthContext);
    const userID = useSelector(authService, userIDSelector);
    const updatedUserInfo = useSelector(authService, userInfoSelector);

    // Don't show your own posts in the feed
    const navigation = useNavigation();
    if (!isProfile && post.user === userID) return <></>;
    if (post.pending?.includes(userID!)) return <></>;
    if (!post.dropoff) return <></>;

    const pickup = convertLocation(post.pickup);
    const dropoff = convertLocation(post.dropoff);
    const fDate = convertDate(post.startTime);
    const fStartTime = convertTime(post.startTime);
    const fEndTime = convertTime(post.endTime);

    const color = isProfile ? Colors.navy : Colors.purple;

    let isMatched = false;
    if (Array.isArray(updatedUserInfo?.matches))
        isMatched =
            userID === post.user || updatedUserInfo?.matches?.includes(post.postID) ? true : false;

    return (
        <Pressable
            onPress={() =>
                isMatched
                    ? navigation.navigate("MatchDetails", { post, list: MatchSublist.matches })
                    : navigation.navigate("PostDetails", { post })
            }
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
                isMatched={isMatched ? isMatched : false}
            />
        </Pressable>
    );
}

type BadgeProps = {
    post: PostType;
    isProfile: boolean;
    isMatched: boolean;
    userInfo: [UserID | null, UserInfo | null];
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
                                        backgroundColor: pressed ? color.m : color.p,
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
    text: {},
});
