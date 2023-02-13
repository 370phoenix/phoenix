import { useState } from "react";
import { StyleSheet, Pressable, Text } from "react-native";

import LocationBadge from "./LocationBadge";
import MatchButton from "./MatchButton";
import RiderBadge from "./RiderBadge";
import { View } from "./Themed";
import Colors from "../constants/Colors";
import { postObject } from "../constants/DataTypes";

export default function PostCard({ post }: { post: postObject }) {
    // Toggle ride/location badge and MoreInfo component
    const [showMore, setShowMore] = useState(false);

    return (
        <View style={styles.cardContainer}>
            <View>
                <Pressable onPress={() => setShowMore(!showMore)}>
                    {!showMore ? <BasicInfo post={post} /> : <MoreInfo post={post} />}
                </Pressable>
            </View>
            <MatchButton />
        </View>
    );
}

// Component containing rider and location badges
function BasicInfo({ post }: { post: postObject }) {
    return (
        <View style={styles.badgesContainer}>
            <LocationBadge post={post} />
            <RiderBadge post={post} />
        </View>
    );
}

// Component containing other information for post
function MoreInfo({ post }: { post: postObject }) {
    const riders = post.riders;
    const listItems = riders.map((rider) => (
        <Text key={rider.gradYear}>
            Gender: {rider.gender}, Grad Year: {rider.gradYear}
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
        backgroundColor: Colors.purple["2"],
        borderRadius: 16,
    },
    badgesContainer: {
        backgroundColor: Colors.purple["2"],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
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
