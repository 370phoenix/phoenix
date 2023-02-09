import { useState } from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import LocationBadge from "./LocationBadge";

import { brandColors } from "../constants/Colors";
import { View } from "./Themed";
import { postObject } from "../constants/Types";
import MatchButton from "./MatchButton";
import RiderBadge from "./RiderBadge";

export default function PostCard({ post }: { post: postObject }) {
    // Toggle ride/location badge and MoreInfo component
    return (
        <View style={styles.cardContainer}>
            <BasicInfo post={post}></BasicInfo>
            <MatchButton />
        </View>
    );
}

// Component containing rider and location badges
function BasicInfo({ post }: { post: postObject }) {
    return (
        <View style={styles.badgesContainer}>
            <LocationBadge post={post}></LocationBadge>
            <RiderBadge post={post}></RiderBadge>
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
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(0,0,0,0.1)" />
                {listItems}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: brandColors.lightPurple,
        borderRadius: 16,
    },
    badgesContainer: {
        backgroundColor: brandColors.lightPurple,
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
        backgroundColor: brandColors.lightPurple,
    },
    separator: {
        marginVertical: 5,
        height: 1,
        width: "80%",
    },
});
