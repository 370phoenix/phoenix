import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import { postObject } from "../constants/DataTypes";
import Colors from "../constants/Colors";

// Function to convert date to string (will be useful for reading from database)
// const dateToString = (tempDate: Date): string => {
//     let fDate =
//         tempDate.getMonth() + 1 + "/" + tempDate.getDate() + "/" + tempDate.getFullYear();
//     let minutes: string | number = tempDate.getMinutes();
//     minutes = minutes < 10 ? "0" + minutes : minutes;
//     let hours: string | number = tempDate.getHours();
//     hours = hours > 12 ? hours - 12 : hours;

//     let fTime = `${hours}:${minutes}`;
//     return fDate + " " + fTime;
// };

export default function LocationBadge({ post }: { post: postObject }) {
    return (
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
