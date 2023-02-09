import { StyleSheet, FlatList, Text } from "react-native";
import { brandColors } from "../constants/Colors";
import PostCard from "./PostCard";
import { fetchPosts } from "../firebase/fetchPosts";
import { View } from "./Themed";
import { useState, useEffect } from "react";

export default function PostList() {
    const [isLoading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (posts.length === 0 && isLoading) {
            fetchPosts()
                .then((response) => setPosts(response))
                .catch((error) => alert(error))
                .finally(() => setLoading(false));
        }
    }, [posts, isLoading]);

    return (
        <View style={styles.listContainer}>
            {posts.length !== 0 && (
                <FlatList
                    data={posts}
                    renderItem={({ item }) => <PostCard key={Math.random()} post={item}></PostCard>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 24,
        backgroundColor: brandColors.darkPurple,
    },
    bodyText: {
        color: "black",
        backgroundColor: "white",
        fontSize: 50,
    },
});
