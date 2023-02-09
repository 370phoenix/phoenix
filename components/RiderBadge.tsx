import { StyleSheet, View } from "react-native";
import { brandColors } from "../constants/Colors";
import { Text } from "./Themed";
import { postObject } from "../constants/Types";

export default function RiderBadge({ post }: { post: postObject }) {
    return (
        // TODO: iconography
        <View style={styles.locationBadge}>
            <Text style={styles.locationText}>
                {post.remainingSpots.filled} / {post.remainingSpots.capacity}
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
        color: brandColors.darkPurple,
        flexWrap: "wrap",
    },
});
