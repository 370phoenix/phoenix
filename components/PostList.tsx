import { useState, useEffect } from "react";
import { StyleSheet, FlatList, Text, ScrollView } from "react-native";

import PostCard from "./PostCard";
import { View } from "./Themed";
import Colors from "../constants/Colors";
import { fetchPosts } from "../firebase/fetchPosts";

export default function PostList() {
    const [isLoading, setLoading] = useState(true);
    const [posts, setPosts] = useState<[string, any][]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (posts.length === 0 && isLoading) {
                try {
                    const res = await fetchPosts();
                    setPosts(Object.entries(res));
                    setLoading(false);
                } catch (e: any) {
                    alert(e);
                }
            }
        };

        fetchData();
        console.log(posts);
    }, [posts, isLoading]);

    const PostCards = posts.map((post) => {
        return <PostCard post={post[1]}/>;
    });

    return (
        <ScrollView>
            <View style={styles.listContainer}>
                {/* {posts.length !== 0 && (
                <FlatList
                    data={posts}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <PostCard post={item}/>}
                    
                />
            )} */}
                {/* <Text>{JSON.stringify(posts)}</Text> */}
                {PostCards}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        // padding: 24,
        // backgroundColor: Colors.purple.p,
    },
});
