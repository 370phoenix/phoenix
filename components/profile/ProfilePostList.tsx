import { useContext } from "react";
import { FlatList, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import PostCard from "../posts/PostCard";
import { View, Text } from "../shared/Themed";
import {
    AuthContext,
    userIDSelector,
    userInfoSelector,
    userPostsSelector,
} from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";

export default function ProfilePostList() {
    const authService = useContext(AuthContext);
    const id = useSelector(authService, userIDSelector);
    const userID = id ? id : "No user found";
    const posts = useSelector(authService, userPostsSelector);
    const userInfo = useSelector(authService, userInfoSelector);

    return (
        <View style={styles.container}>
            <Text textStyle="header" style={styles.header}>
                Your Posts
            </Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                style={styles.list}
                data={posts}
                renderItem={({ item }) => (
                    <PostCard post={item} isProfile userInfo={[userID ? userID : "", userInfo]} />
                )}
                contentContainerStyle={{ paddingBottom: 50 }}
            />
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
