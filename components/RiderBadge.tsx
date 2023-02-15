import { StyleSheet, View } from "react-native";

import { Text } from "./Themed";
import Colors from "../constants/Colors";
import { PostType } from "../constants/DataTypes";

export default function RiderBadge({ post }: { post: PostType }) {
    return (
        // TODO: iconography
        <View style={styles.locationBadge}>
            <Text style={styles.locationText}>
                {post.availableSpots} / {post.numFriends + post.availableSpots}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    locationBadge: {
        margin: 8,
        backgroundColor: "white",
        borderRadius: 48,
        padding: 8,
        alignItems: "center",
        alignSelf: "flex-start",
        width: "20%",
        flexDirection: "row",
        justifyContent: "center",
    },
    locationText: {
        fontSize: 16,
        color: Colors.purple.p,
        flexWrap: "wrap",
    },
});
