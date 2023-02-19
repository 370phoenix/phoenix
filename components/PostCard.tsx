import { StyleSheet, Pressable } from "react-native";

import { View, Text, Spacer } from "./Themed";
import Colors from "../constants/Colors";
import { PostType } from "../constants/DataTypes";
import { convertDate, convertLocation, convertTime } from "../firebase/ConvertPostTypes";
import { useNavigation } from "@react-navigation/native";
import { Right } from "../assets/icons/Arrow";

export default function PostCard({ post }: { post: PostType }) {
    const navigation = useNavigation();
    const pickup = convertLocation(post.pickup);
    const dropoff = convertLocation(post.dropoff);
    const fDate = convertDate(post.startTime);
    const fStartTime = convertTime(post.startTime);
    const fEndTime = convertTime(post.endTime);

    return (
        <Pressable onPress={() => navigation.navigate("PostDetails", { post: post })}>
            <View style={styles.cardContainer}>
                <View style={styles.headerContainer}>
                    <Text textStyle="header" styleSize="s" style={styles.text}>
                        {pickup}
                    </Text>
                    <Spacer direction="row" size={16} />
                    <Right color={Colors.purple.p} />
                </View>
                <Text textStyle="header" styleSize="s" style={styles.text}>
                    {dropoff}
                </Text>
                <Spacer direction="column" size={16} />

                <Text style={styles.text}>{fDate}</Text>
                <Text style={styles.text}>
                    {fStartTime} - {fEndTime}
                </Text>
                <RiderBadge post={post} />
            </View>
        </Pressable>
    );
}

function RiderBadge({ post }: { post: PostType }) {
    return (
        <View style={styles.riderBadge}>
            <Text>
                {post.availableSpots} / {post.numFriends + post.availableSpots + 1}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.gray.w,
        borderRadius: 8,
        justifyContent: "center",
    },
    text: {
        color: Colors.purple.p,
    },
    riderBadge: {
        marginTop: 8,
        marginBottom: 16,
        backgroundColor: "white",
        borderRadius: 48,
        padding: 8,
        alignSelf: "flex-start",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});
