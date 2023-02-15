import { useState } from "react";
import { StyleSheet, Pressable, Text } from "react-native";

import DetailsModal from "./DetailsModal";
import { View } from "./Themed";
import Colors from "../constants/Colors";
import { PostType } from "../constants/DataTypes";

export default function PostCard({ post }: { post: PostType }) {
    // Toggle ride/location badge and MoreInfo modal
    const [showModal, setShowModal] = useState(false);

    const onRequestClose = () => {
        alert("Modal has been closed.");
        setShowModal(!showModal);
    };

    const onPress = () => setShowModal(!showModal);

    return (
        <View style={styles.cardContainer}>
            <Pressable onPress={() => setShowModal(!showModal)}>
                <DetailsModal post={post} onPress={onPress} onRequestClose={onRequestClose} isVisible={showModal}/>
                <BasicInfo post={post} />
            </Pressable>
        </View>
    );
}

function BasicInfo({ post }: { post: PostType }) {
    const pickup = post.pickup;
    const dropoff = post.dropoff;
    const fDate = new Date(post.dateTime).toDateString();
    const fTime = new Date(post.dateTime).toLocaleTimeString();

    return (
        <View>
            <Text>
                {typeof pickup === "string" ? pickup : "Pickup not found"}
                {" ->\n"}
                {typeof dropoff === "string" ? dropoff : "Dropoff not found"}
            </Text>
            <Text>{fDate}</Text>
            <Text>{fTime}</Text>
            <RiderBadge post={post} />
        </View>
    );
}

function RiderBadge({ post }: { post: PostType }) {
    return (
        <View style={styles.riderBadge}>
            <Text>
                {post.availableSpots} / {post.numFriends + post.availableSpots}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 8,
        padding: 16,
        backgroundColor: Colors.purple[2],
        fontSize: 20,
    },
    riderBadge: {
        marginTop: 8,
        backgroundColor: "white",
        borderRadius: 48,
        padding: 8,
        alignSelf: "flex-start",
    },
});
