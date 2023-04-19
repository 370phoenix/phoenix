import { Pressable, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../constants/Colors";
import { useSelector } from "@xstate/react";
import { useContext } from "react";
import { AuthContext, userInfoSelector } from "../../utils/machines/authMachine";
import { PostToFBSchema, PostType } from "../../utils/postValidation";
import { PostCardGuts } from "./PostCardShared";

type Props = {
    isProfile?: boolean;
    post: PostType;
};
export default function FeedCard({ post }: Props) {
    const authService = useContext(AuthContext);
    const userInfo = useSelector(authService, userInfoSelector);

    // Don't show your own posts in the feed
    const navigation = useNavigation();
    if (!userInfo) return <></>;
    const { userID } = userInfo;

    if (post.user === userID) return <></>;
    if (post.pending && post.pending[userID]) return <></>;
    if (!post.dropoff) return <></>;

    const isMatched = post.riders && post.riders[userID];

    return (
        <Pressable
            onPress={() => {
                if (!isMatched)
                    navigation.navigate("PostDetails", { post: PostToFBSchema.parse(post) });
            }}
            style={({ pressed }) => [
                styles.cardContainer,
                {
                    backgroundColor: pressed ? Colors.gray[4] : Colors.gray.w,
                    marginHorizontal: 16,
                    flexDirection: "row",
                },
            ]}
            key={post.postID}>
            <PostCardGuts
                post={post}
                isProfile={false}
                isMatched={isMatched ?? false}
                userInfo={userInfo}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        shadowColor: Platform.OS === "ios" ? Colors.purple.p : undefined,
        shadowOpacity: 0.5,
        elevation: 10,
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowRadius: 4,
    },
});
