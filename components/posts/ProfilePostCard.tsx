import { useNavigation } from "@react-navigation/native";
import { useMachine } from "@xstate/react";
import { Platform, Pressable, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { UserInfo } from "../../utils/auth";
import { chatHeaderMachine } from "../../utils/machines/chatHeaderMachine";
import { PostType, PostToFBSchema } from "../../utils/postValidation";
import { PostCardGuts } from "./PostCardShared";

interface ProfilePostCardProps {
    post: PostType;
    userInfo: UserInfo;
}
export default function ProfilePostCard({ post, userInfo }: ProfilePostCardProps) {
    // Don't show your own posts in the feed
    const navigation = useNavigation();
    if (!userInfo) return <></>;
    if (!post.dropoff) return <></>;

    const [state, send] = useMachine(chatHeaderMachine);
    if (state.matches("Start")) send({ type: "INIT", postID: post.postID });
    const { header } = state.context;

    return (
        <Pressable
            onPress={() => {
                if (!header) return;
                const serializedPost = PostToFBSchema.parse(post);
                navigation.navigate("ChatScreen", { post: serializedPost, header });
            }}
            style={({ pressed }) => [
                styles.cardContainer,
                {
                    backgroundColor: pressed ? Colors.gray[4] : Colors.gray.w,
                    marginHorizontal: 0,
                    flexDirection: "column",
                },
            ]}
            key={post.postID}>
            <PostCardGuts post={post} isProfile={true} isMatched={true} userInfo={userInfo} />
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
