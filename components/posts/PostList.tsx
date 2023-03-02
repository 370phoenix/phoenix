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
    // REFRESH OFF FOR NOW - uneeded API call, auto-refresh implemented.
    // const [refreshing, setRefreshing] = useState(false);
    // pull down to refresh, updates posts
    // const onRefresh: any = async () => {
    //     setLoading(true);
    //     // setRefreshing(true);
    //     await fetchData();
    //     // setRefreshing(false);
    //     setLoading(false);
    // };

    useEffect(() => {
        const res = getAllPostUpdates((post) => {
            setPosts((prev) => {
                let i = 0;
                if ((i = prev.findIndex((val) => val.postID == post.postID)) !== -1) {
                    const found = prev[i];
                    if (comparePosts(found, post)) return prev;

                    // Else, replace post
                    const newPosts = prev;
                    newPosts.splice(i, 1);
                    return [...newPosts, post];
                }
                return [...prev, post];
            });
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
                    // refreshControl={
                    //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    // }
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <PostCard post={item} />}
                />
            )}
        </View>
    );
}
