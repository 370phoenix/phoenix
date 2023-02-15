import React from "react";
import { Modal, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import MatchButton from "./MatchButton";
import { View, Text } from "./Themed";
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
    return (
        <View>
            <Text>DETAILS</Text>
            <Text>
                From {Convert.convertLocation(post.pickup)} to{" "}
                {Convert.convertLocation(post.dropoff)}
            </Text>
            <Text>
                Time: {Convert.convertTime(post.startTime)} - {Convert.convertTime(post.endTime)}
            </Text>
            <Text>{post.roundTrip ? "Round trip" : "One way"}</Text>
            <Text>Notes: {post.notes}</Text>
            <Text>RIDER PROFILES</Text>
            <MatchButton />
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
