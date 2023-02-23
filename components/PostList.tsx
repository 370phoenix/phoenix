import { useState, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";

import PostCard from "./PostCard";
import { View, Text } from "./Themed";
import { fetchPosts } from "../firebase/fetchPosts";
import Colors from "../constants/Colors";
import { PostType } from "../constants/DataTypes";

export default function PostList() {
    const [isLoading, setLoading] = useState(true);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        if ((posts.length === 0 && isLoading) || refreshing) {
            const res = await fetchPosts();
            if (typeof res !== "string") setPosts(res);
            setLoading(false);
        }
    };

    // pull down to refresh, updates posts
    const onRefresh: any = async () => {
        setLoading(true);
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [posts, isLoading]);

    return (
        <View style={{ marginTop: 20 }}>
            {typeof posts === "string" && (
                <Text style={{ color: Colors.red.p }} textStyle="label" styleSize="l">
                    Failed to retrieve posts
                </Text>
            )}
            {typeof posts !== "string" && posts.length !== 0 && (
                <FlatList
                    data={posts}
                    style={{ paddingTop: 16 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <PostCard post={item} />}
                />
            )}
        </View>
    );
}
