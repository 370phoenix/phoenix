import { useState } from "react";
import { StyleSheet, Pressable, Text } from "react-native";

import MatchButton from "./MatchButton";
import RiderBadge from "./RiderBadge";
import { View } from "./Themed";
import Colors from "../constants/Colors";
import { PostType } from "../constants/DataTypes";

// TODO: Redo PostCard component

export default function PostCard({ post }: { post: PostType }) {
    // Toggle ride/location badge and MoreInfo component
    const [showMore, setShowMore] = useState(false);

    return (
        <View style={styles.cardContainer}>
            <BasicInfo post={post} />
        </View>
    );
}

// Component containing rider and location badges
function BasicInfo({ post }: { post: PostType }) {
    const pickup = post.pickup;
    const dropoff = post.dropoff;
    const fDate = new Date(post.dateTime).toDateString();
    const fTime = new Date(post.dateTime).toLocaleTimeString();

    return (
        <View>
            <Text style={{color: Colors.gray.b, fontSize: 20}}>Hello</Text>
            {/* <Text>
                    {typeof pickup === "string" ? pickup : "Pickup not found"} to
                    {typeof dropoff === "string" ? dropoff : "Dropoff not found"}
                </Text>
                <Text>{fDate}</Text>
                <Text>{fTime}</Text>
                <RiderBadge post={post} /> */}
        </View>
    );
}

// Component containing other information for post
function MoreInfo({ post }: { post: PostType }) {
    const riders = post.riders;
    const listItems = riders.map((rider) => (
        <Text key={rider}>
            Placeholder for moreinfo{/* Gender: {rider.gender}, Grad Year: {rider.gradYear} */}
        </Text>
    ));
    return (
        <View style={styles.moreInfoContainer}>
            <View style={styles.moreInfo}>
                <Text>More Information: </Text>
                <View style={styles.separator} />
                {listItems}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: Colors.purple.p,
        fontSize: 20,
        flex: 1,
    },
    badgesContainer: {
        backgroundColor: Colors.purple["2"],
        // flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "center",
        // flex: 1,
    },
    moreInfo: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 8,
        margin: 8,
    },
    moreInfoContainer: {
        backgroundColor: Colors.purple["2"],
    },
    separator: {
        marginVertical: 5,
        height: 1,
        width: "80%",
    },
});
