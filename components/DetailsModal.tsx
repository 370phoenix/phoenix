import React from "react";
import { Modal, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import MatchButton from "./MatchButton";
import { View, Text } from "./Themed";
import { PostType } from "../constants/DataTypes";

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
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent
                visible={isVisible}
                onRequestClose={onRequestClose}>
                <TouchableOpacity activeOpacity={1} onPressOut={onPress} style={styles.background}>
                    <ScrollView directionalLockEnabled>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <MoreInfo post={post} />
                            </View>
                        </View>
                    </ScrollView>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

function MoreInfo({ post }: { post: PostType }) {
    return (
        <View>
            <Text>Notes: {post.notes}</Text>
            <Text>Time: {post.dateTime}</Text>
            <Text>{post.roundTrip ? "Round trip" : "One way"}</Text>
            <MatchButton />
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
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
        height: "100%",
    },
});
