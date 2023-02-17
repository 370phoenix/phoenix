import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";

import { View, Text, Spacer, Button } from "../components/Themed";
import Colors from "../constants/Colors";
import { PostID, PostType } from "../constants/DataTypes";
import { MessageType } from "../firebase/auth";
import Convert from "../firebase/ConvertPostTypes";
import { fetchPost } from "../firebase/fetchPosts";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "PostDetails">;
export default function DetailsModal({ route }: Props) {
    const [post, setPost] = useState<PostType | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const getPostInfo = async (postID: PostID) => {
            const res = await fetchPost(postID);
            if (res.type === MessageType.error) setMessage(res.message);
            else setPost(res.data);
        };

        if (!route.params) return;
        const paramPost = route.params.post;
        if (paramPost instanceof Object && "postID" in paramPost) {
            setPost(paramPost);
        } else {
            getPostInfo(paramPost);
        }
    }, [route.params]);

    return (
        <ScrollView directionalLockEnabled style={styles.container}>
            {message && (
                <Text textStyle="label" style={{ color: Colors.red.p, textAlign: "center" }}>
                    {message}
                </Text>
            )}
            {post && <MoreInfo post={post} />}
        </ScrollView>
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
        <View style={styles.infoContainer}>
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
    container: {
        backgroundColor: Colors.gray[4],
    },
    infoContainer: {
        paddingTop: 32,
        paddingHorizontal: 16,
    },
});
