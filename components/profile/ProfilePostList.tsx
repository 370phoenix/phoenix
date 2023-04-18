import { useContext } from "react";
import { FlatList, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { View, Text } from "../shared/Themed";
import { AuthContext, userInfoSelector, userPostsSelector } from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";
import ProfilePostCard from "../posts/ProfilePostCard";

export default function ProfilePostList() {
    const authService = useContext(AuthContext);
    const posts = useSelector(authService, userPostsSelector);
    const userInfo = useSelector(authService, userInfoSelector);
    const { userID } = userInfo ?? {};

    if (!userID || !userInfo) return <></>;

    return (
        <View style={styles.container}>
            <Text textStyle="header" style={styles.header}>
                Your Posts
            </Text>
            <FlatList
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                data={posts}
                renderItem={({ item }) => {
                    return <ProfilePostCard post={item} userInfo={userInfo} />;
                }}
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
