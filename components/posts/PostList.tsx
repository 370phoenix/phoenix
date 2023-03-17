import { useState, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";

import Colors from "../../constants/Colors";
import { PostType } from "../../constants/DataTypes";
import { MessageType } from "../../utils/auth";
import { comparePosts, fetchAllPosts, getAllPostUpdates } from "../../utils/posts";
import { View, Text } from "../shared/Themed";

import PostCard from "./PostCard";

export default function PostList() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [message, setMesssage] = useState<string | null>(null);

    useEffect(() => {
        const res = getAllPostUpdates({
            onChildChanged: (post) => {
                setPosts((prev) => {
                    let i = 0;
                    if ((i = prev.findIndex((val) => val.postID === post.postID)) !== -1) {
                        // MUST change array address (create a new array) to cause a re-render. Copy arrays like below for state changes.
                        const newPosts = [...prev];
                        newPosts[i] = post;
                        return newPosts;
                    }
                    return prev;
                });
            },
            onChildAdded: (post) => {
                setPosts((prev) => [...prev, post]);
            },
            onChildRemoved: (post) => {
                setPosts((prev) => {
                    let i = 0;
                    if ((i = prev.findIndex((val) => val.postID === post.postID)) !== -1) {
                        const newPosts = [...prev];
                        newPosts.splice(i, 1);
                        return newPosts;
                    }
                    return prev;
                });
            },
        });

        if (res.type === MessageType.error) {
            setMesssage(res.message);
            return;
        }

        const unsubscribe = res.data;
        return () => {
            unsubscribe();
        };
    }, [setMesssage]);

    return (
        <View style={{ marginTop: 20 }}>
            {message && (
                <Text style={{ color: Colors.red.p }} textStyle="label" styleSize="l">
                    {message}
                </Text>
            )}
            {posts && posts.length !== 0 && (
                <FlatList
                    data={posts}
                    style={{ paddingTop: 16, paddingBottom: 200 }}
                    keyExtractor={(item) => item.postID}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <PostCard post={item} />}
                />
            )}
        </View>
    );
}
