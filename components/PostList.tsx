import { StyleSheet, FlatList } from "react-native";
import PostCard from "./PostCard";
import { fetchPosts } from "../firebase/fetchPosts";
import { View } from "./Themed";
import { useState, useEffect } from "react";
import Colors from "../constants/Colors";

export default function PostList() {
    const [isLoading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (posts.length === 0 && isLoading) {
                try {
                    const res = await fetchPosts();
                    setPosts(res);
                    setLoading(false);
                } catch (e: any) {
                    alert(e);
                }
            }
        };

        fetchData();
    }, [posts, isLoading]);

    return (
        <View style={styles.listContainer}>
            {posts.length !== 0 && (
                <FlatList
                    data={posts}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <PostCard key={Math.random()} post={item}></PostCard>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 24,
        backgroundColor: Colors.purple.p,
    },
    bodyText: {
        color: "black",
        backgroundColor: "white",
        fontSize: 50,
    },
});
