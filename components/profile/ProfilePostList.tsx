import { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { PostType, PostID } from "../../constants/DataTypes";
import { MessageType, UserInfo } from "../../utils/auth";
import { fetchSomePosts } from "../../utils/posts";
import PostCard from "../posts/PostCard";
import { View, Text } from "../shared/Themed";
import { AuthContext, userIDSelector } from "../../utils/machines/authMachine";
import { useMachine, useSelector } from "@xstate/react";
import { profilePostMachine } from "../../utils/machines/profilePostsMachine";

type Props = {
    userInfo: UserInfo | null;
};
export default function ProfilePostList({ userInfo }: Props) {
    const authService = useContext(AuthContext);
    const id = useSelector(authService, userIDSelector);
    const userID = id ? id : "No user found";
    const [state, send] = useMachine(profilePostMachine);
    const { error, posts } = state.context;

    useEffect(() => {
        if (!userInfo) return;
        console.log(state);
        if (state.matches("Updating Posts.Start")) send("LOAD", { userPosts: userInfo.posts });
        else send("UPDATE", { userPosts: userInfo.posts });

        () => {
            send("EXIT");
        };
    }, [send, userInfo]);

    return (
        <View style={styles.container}>
            <Text textStyle="header" style={styles.header}>
                Your Posts
            </Text>
            {error && (
                <Text textStyle="label" style={styles.error}>
                    {error}
                </Text>
            )}
            {posts && (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={posts}
                    renderItem={({ item }) => (
                        <PostCard
                            post={item}
                            isProfile
                            userInfo={[userID ? userID : "", userInfo]}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 50 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flex: 1,
    },
    header: {
        color: Colors.gray.w,
    },
    error: {
        color: Colors.red.p,
    },
    list: {
        marginTop: 16,
    },
});
