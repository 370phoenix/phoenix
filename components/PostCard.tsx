import { useState } from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import LocationBadge from "./LocationBadge";

import { brandColors } from "../constants/Colors";
import { View } from "./Themed";
import { postObject } from "../constants/Types";
import MatchButton from "./MatchButton";
import RiderBadge from "./RiderBadge";

export default function PostCard({ post }: { post: postObject }) {
    const [display, setDisplay] = useState("front");
    return (
        <View style={styles.cardContainer}>
            <Pressable
                onPress={() => {
                    setDisplay(display === "front" ? "back" : "front");
                }}>
                <View>{display === 'front'? <CardFront post={post}></CardFront> : <MoreInfo post={post}></MoreInfo>}</View>
            </Pressable>
            <MatchButton />
        </View>
    );
}

function CardFront({ post }: { post: postObject }) {
    return (
        <View style={styles.badgeContainer}>
            <LocationBadge post={post}></LocationBadge>
            <RiderBadge post={post}></RiderBadge>
        </View>
    );
}

function MoreInfo({ post }: { post: postObject }) {
    const riders = post.riders;
    const listItems = riders.map((rider) => (
        <Text key={rider.gradYear}>
            Gender: {rider.gender}, Grad Year: {rider.gradYear}
        </Text>
    ));
    return <View style={styles.moreInfo}>{listItems}</View>;
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: brandColors.lightPurple,
        borderRadius: 16,
    },
    badgeContainer: {
        backgroundColor: brandColors.lightPurple,
        flexDirection: "row",
    },
    moreInfo: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 8,
        width: '90%',
        margin: 8
    }
});
