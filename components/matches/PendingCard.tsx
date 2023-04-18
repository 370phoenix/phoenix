import { StyleSheet } from "react-native";

import { View } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { useMachine } from "@xstate/react";
import { postInfoMachine } from "../../utils/machines/postInfoMachine";
import { PostType } from "../../utils/postValidation";
import { MatchCardGuts } from "./MatchCard";

export type Props = {
    postID: string;
};

export default function PendingCard({ postID }: Props) {
    const [state, send] = useMachine(postInfoMachine);
    if (state.matches("Start")) send("LOAD", { id: postID });
    const { post } = state.context as { post: PostType | null };

    // TODO: Verify post.pickup and post.dropoff are correct.
    if (!post) return <></>;
    return (
        <View style={styles.cardContainer}>
            <MatchCardGuts post={post} color={Colors.purple.p} />
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        paddingLeft: 16,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.gray.w,
        opacity: 0.7,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
});
