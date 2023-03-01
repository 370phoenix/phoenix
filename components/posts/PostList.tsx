import { useState, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";
import Colors from "../../constants/Colors";
import { PostType } from "../../constants/DataTypes";
import { MessageType } from "../../utils/auth";
import { fetchAllPosts } from "../../utils/posts";
import { View, Text } from "../shared/Themed";

import PostCard from "./PostCard";

export default function PostList() {
    const [isLoading, setLoading] = useState(true);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [message, setMesssage] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        if ((posts.length === 0 && isLoading) || refreshing) {
            const res = await fetchAllPosts();
            if (res.type === MessageType.success) setPosts(res.data);
            else setMesssage(res.message);
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
            {message && (
                <Text style={{ color: Colors.red.p }} textStyle="label" styleSize="l">
                    {message}
                </Text>
            )}
            {posts && posts.length !== 0 && (
                <FlatList
                    data={posts}
                    style={{ paddingTop: 16, paddingBottom: 200 }}
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
