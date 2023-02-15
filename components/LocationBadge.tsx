import { StyleSheet } from "react-native";

import { Text, View } from "./Themed";
import Colors from "../constants/Colors";
import { PostType } from "../constants/DataTypes";

export default function LocationBadge({ post }: { post: PostType }) {
    return (
        <View style={styles.locationBadge}>
            {/* <Text style={styles.locationText}>
                Trip: {post.pickup} to {post.dropoff}
            </Text>
            <Text style={styles.locationText}>
                Between: {post.dateTime}
            </Text> */}
        </View>
    );
}

const styles = StyleSheet.create({
    locationBadge: {
        margin: 8,
        backgroundColor: "white",
        borderRadius: 8,
        padding: 8,
        width: "70%",
    },
    locationText: {
        fontSize: 16,
        color: Colors.purple.p,
    },
});
