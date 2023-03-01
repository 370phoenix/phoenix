import { useState, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";

import Colors from "../../constants/Colors";
import { PostType } from "../../constants/DataTypes";
import { MessageType } from "../../utils/auth";
import { fetchAllPosts, getAllPostUpdates } from "../../utils/posts";
import { View, Text } from "../shared/Themed";

import PostCard from "./PostCard";

export default function PostList() {
    const [isLoading, setLoading] = useState(true);
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
        const res = getAllPostUpdates((posts) => {
            setPosts(posts);
        });

        if (res.type === MessageType.error) {
            setMesssage(res.message);
            return;
        }

        const unsubscribe = res.data;
        return () => {
            unsubscribe();
        };
    }, [posts, isLoading]);

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
