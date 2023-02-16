import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import { View, Text, Spacer, Button } from "./Themed";
import Colors from "../constants/Colors";
import { PostType } from "../constants/DataTypes";
import Convert from "../firebase/ConvertPostTypes";

export default function DetailsModal({
    post,
    onPress,
    onRequestClose,
    isVisible,
}: {
    post: PostType;
    onPress: any;
    onRequestClose: any;
    isVisible: boolean;
}) {
    return (
        <Modal
            animationType="slide"
            transparent
            visible={isVisible}
            onRequestClose={onRequestClose}>
            <TouchableOpacity activeOpacity={1} onPressOut={onPress} style={styles.background} />
            <ScrollView directionalLockEnabled>
                <View style={styles.modalView}>
                    <MoreInfo post={post} />
                </View>
            </ScrollView>
        </Modal>
    );
}

function MoreInfo({ post }: { post: PostType }) {
    const [matched, setMatched] = useState(false);
    const onChangeMatched = () => setMatched(!matched);

    const pickup = Convert.convertLocation(post.pickup);
    const dropoff = Convert.convertLocation(post.dropoff);
    const date = Convert.convertDate(post.startTime);
    const startTime = Convert.convertTime(post.startTime);
    const endTime = Convert.convertTime(post.endTime);
    return (
        <View>
            <Text textStyle="header">Ride Information</Text>
            <Spacer direction="column" size={16} />
            <Text textStyle="label">
                {pickup} {"->"} {dropoff}
            </Text>
            <Text>{date}</Text>
            <Text>
                {startTime} - {endTime}
            </Text>
            <Spacer direction="column" size={16} />
            <Text textStyle="label">{post.roundTrip ? "Round trip" : "One way"}</Text>
            <Spacer direction="column" size={16} />
            <Text>Notes: {post.notes}</Text>
            <Spacer direction="column" size={40} />
            <Text textStyle="header">Rider Profiles</Text>
            <Spacer direction="column" size={16} />
            <Text textStyle="label">Profile 1</Text>
            <Text textStyle="label">Profile 2</Text>
            <Spacer direction="column" size={40} />
            <Button
            title={matched ? "Cancel Match" : "Match!"}
            onPress={onChangeMatched}
            color="purple"
        />
            <Spacer direction="column" size={800} />
        </View>
    );
}

const styles = StyleSheet.create({
    modalView: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: Colors.gray.w,
        padding: 32,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    background: {
        width: "100%",
        height: 96,
    },
});
