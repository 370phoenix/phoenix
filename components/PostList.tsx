import { useState, useEffect } from "react";
import { StyleSheet, FlatList, Text } from "react-native";

import PostCard from "./PostCard";
import { View } from "./Themed";
import Colors from "../constants/Colors";
import { fetchPosts } from "../firebase/fetchPosts";

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
        console.log(posts);
    }, [posts, isLoading]);

    return (
        <View style={styles.listContainer}>
            {/* {posts.length !== 0 && (
                <FlatList
                    data={posts}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <PostCard post={item}/>}
                    
                />
            )} */}
            <Text>{JSON.stringify(posts)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        // padding: 24,
        // backgroundColor: Colors.purple.p,
    },
});
