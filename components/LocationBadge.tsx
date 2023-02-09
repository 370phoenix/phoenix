import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import { postObject } from "../constants/Types";
import Colors from "../constants/Colors";

export default function LocationBadge({ post }: { post: postObject }) {
    return (
        // TODO: Replace pickup, destination, time with proper icons
        <View style={styles.locationBadge}>
            <Text style={styles.locationText}>
                Trip: {post.pickupLocation} to {post.dropoffLocation}
            </Text>
            <Text style={styles.locationText}>
                Between: {post.earliestTime} - {post.latestTime}
            </Text>
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
