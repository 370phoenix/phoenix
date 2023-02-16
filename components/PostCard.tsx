import { useState } from "react";
import { StyleSheet, Pressable } from "react-native";

import DetailsModal from "./DetailsModal";
import { View, Text, Spacer } from "./Themed";
import Colors from "../constants/Colors";
import { PostType } from "../constants/DataTypes";
import Convert from "../firebase/ConvertPostTypes";

export default function PostCard({ post }: { post: PostType }) {
    // Toggle ride/location badge and MoreInfo modal
    const [showModal, setShowModal] = useState(false);

    const onRequestClose = () => {
        alert("Modal has been closed.");
        setShowModal(!showModal);
    };

    const onPress = () => setShowModal(!showModal);

    return (
        <View>
            <Pressable onPress={() => setShowModal(!showModal)}>
                <DetailsModal post={post} onPress={onPress} onRequestClose={onRequestClose} isVisible={showModal}/>
                <BasicInfo post={post} />
            </Pressable>
        </View>
    );
}

function BasicInfo({ post }: { post: PostType }) {
    const pickup = Convert.convertLocation(post.pickup);
    const dropoff = Convert.convertLocation(post.dropoff);
    const fDate = Convert.convertDate(post.startTime);
    const fStartTime = Convert.convertTime(post.startTime);
    const fEndTime = Convert.convertTime(post.endTime);

    return (
        <View style={styles.cardContainer}>
            <Text textStyle="label">
                {pickup}
                {" ->\n"}
                {dropoff}
            </Text>
            <Text>{fDate}</Text>
            <Text>{fStartTime} - {fEndTime}</Text>
            <RiderBadge post={post} />
        </View>
    );
}

function RiderBadge({ post }: { post: PostType }) {
    return (
        <View style={styles.riderBadge}>
            <Text style={styles.bodyText}>
                {post.availableSpots} / {post.numFriends + post.availableSpots + 1}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 8,
        paddingTop: 16,
        paddingLeft: 16,
        backgroundColor: Colors.purple[2],
        borderRadius: 16
    },
    riderBadge: {
        marginTop: 8,
        marginBottom: 16,
        backgroundColor: "white",
        borderRadius: 48,
        padding: 8,
        alignSelf: "flex-start",
    },
    bodyText: {
        fontSize: 16
    }
});
