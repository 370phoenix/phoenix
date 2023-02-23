import { getAuth } from "firebase/auth/react-native";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { PostID, PostType } from "../constants/DataTypes";
import { MessageType, UserInfo } from "../firebase/auth";
import { fetchSomePosts } from "../firebase/posts";
import PostCard from "./PostCard";
import { View, Text } from "./Themed";

type Props = {
    userInfo: UserInfo | null;
};
export default function ProfilePostList({ userInfo }: Props) {
    const [posts, setPosts] = useState<PostType[] | null>(null);
    const [loaded, setLoaded] = useState<PostID[] | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    // Fetch post info when user info updates
    useEffect(() => {
        if (!userInfo) return;
        const userPosts = userInfo.posts;

        const removeUserPosts = () => {
            if (!posts || !loaded) return;
            if (!userPosts || userPosts.length === 0) {
                setPosts(null);
                setLoaded(null);
            } else if (userPosts) {
                for (const post of posts) {
                    if (!userPosts.includes(post.postID)) {
                        const i = posts.indexOf(post);
                        const j = loaded.indexOf(post.postID);
                        const newPosts = posts;
                        const newLoaded = loaded;
                        newPosts.splice(i, 1);
                        newLoaded.splice(j, 1);
                        setPosts(newPosts);
                        setLoaded(newLoaded);
                    }
                }
            }
        };

        const loadUserPosts = async () => {
            if (!userPosts) return;
            let toLoad: PostID[] = [];
            if (loaded) {
                for (const id of userPosts) {
                    if (!loaded.includes(id)) toLoad.push(id);
                }
            } else toLoad = userPosts;

            if (toLoad.length < 1) return;

            const res = await fetchSomePosts(toLoad);
            if (res.type === MessageType.error) {
                setMessage(res.message);
                return;
            }
            if (!res.data) return;

            let newPosts;
            if (posts) {
                newPosts = posts.concat(res.data);
            } else newPosts = res.data;
            newPosts.sort((a, b) => a.startTime - b.startTime);
            setPosts(newPosts);

            if (loaded) {
                const newLoaded = loaded.concat(toLoad);
                setLoaded(newLoaded);
            } else setLoaded(toLoad);
        };

        removeUserPosts();
        loadUserPosts();
    }, [userInfo]);

    return (
        <View style={styles.container}>
            <Text textStyle="header" style={styles.header}>
                Your Posts
            </Text>
            {message && (
                <Text textStyle="label" style={styles.error}>
                    {message}
                </Text>
            )}
            {posts && (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={posts}
                    renderItem={({ item }) => (
                        <PostCard
                            post={item}
                            isProfile
                            userInfo={[userId ? userId : "", userInfo]}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 50 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flex: 1,
    },
    header: {
        color: Colors.gray.w,
    },
    error: {
        color: Colors.red.p,
    },
    list: {
        marginTop: 16,
    },
});
