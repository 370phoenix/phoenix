import { useState, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";

import PostCard from "./PostCard";
import { View } from "./Themed";
import { fetchPosts } from "../firebase/fetchPosts";

export default function PostList() {
    const [isLoading, setLoading] = useState(true);
    const [posts, setPosts] = useState<[string, any][]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        if ((posts.length === 0 && isLoading) || refreshing) {
            try {
                const res = await fetchPosts();
                setPosts(Object.entries(res));
                setLoading(false);
            } catch (e: any) {
                alert(e);
            }
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
        <View>
            {posts.length !== 0 && (
                <FlatList
                    data={posts}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <PostCard post={item[1]} />}
                />
            )}
        </View>
    );
}

