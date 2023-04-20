import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Pressable } from "react-native";

import { View, Text, Spacer } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { PostType } from "../../utils/postValidation";
import { convertDate } from "../../utils/convertPostTypes";
import RoundTrip from "../../assets/icons/RoundTrip";
import { Right } from "../../assets/icons/Arrow";
import FeedbackExclaim from "../../assets/icons/feedbackExclaim";

// export type Props = {
//     post: PostType;
// };

export default function PastPostsCard({ post }: Props) {
    //what do we use instead of props?
    const navigation = useNavigation();
    const colorPurple = Colors.purple.p;

    if (!post) return <View />;

    return (
        <Pressable
            onPress={() => navigation.navigate("PastPostDetails", { post })}
            style={({ pressed }) => [
                styles.cardContainer,
                {
                    backgroundColor: pressed ? Colors.gray[4] : Colors.gray.w,
                    marginHorizontal: 16,
                    flexDirection: "row",
                },
            ]}>
            <View style={styles.body}>
                <Text textStyle="header" styleSize="s" style={{ color: colorPurple }}>
                    {post.pickup}
                </Text>
                <View style={styles.headerContainer}>
                    {post.roundTrip ? (
                        <RoundTrip color={colorPurple} height={20} />
                    ) : (
                        <Right color={colorPurple} height={20} />
                    )}
                    <Text textStyle="header" styleSize="s" style={{ color: colorPurple }}>
                        {post.dropoff}
                    </Text>
                </View>
                {/* <Spacer direction="column" size={16} /> */}

                <View style={styles.iconRow}>
                    <Text textStyle="label" style={{ color: colorPurple }}>
                        {convertDate(post.startTime)}
                    </Text>
                    <FeedbackExclaim height={35} />
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderRadius: 8,
        marginBottom: 8,
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
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
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
    iconRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between", //flex-start, flex-end, center, space-between, space-around, and space-evenly
        alignItems: "center", //flex-start, flex-end, center, and baseline.

        //add padding to card, arrow and destination in same row
    },
});
