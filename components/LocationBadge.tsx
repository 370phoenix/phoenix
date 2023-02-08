import { StyleSheet } from "react-native";
import { brandColors } from "../constants/Colors";
import { Text, View } from "./Themed";
import { postObject } from "../constants/Types";

export default function LocationBadge({ post }: { post: postObject }) {
    return (
        // TODO: Replace pickup, destination, time with proper icons
        <View style={styles.locationBadge}>
                <Text style={styles.locationText}>
                    Trip: {post.pickupLocation} to {post.dropoffLocation}
                </Text>
                <Text style={styles.locationText}>
                    Between: {post.pickupTime} - {post.dropoffTime}
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
        color: brandColors.darkPurple,
    },
});
