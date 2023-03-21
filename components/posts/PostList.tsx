import { useMachine } from "@xstate/react";
import { FlatList } from "react-native";

import PostCard from "./PostCard";
import { postListMachine } from "../../utils/machines/postListMachine";
import { View } from "../shared/Themed";

export default function PostList() {
    const [state, _] = useMachine(postListMachine);
    const { posts } = state.context;

    return (
        <View style={{ marginTop: 20 }}>
            {posts && posts.length !== 0 && (
                <FlatList
                    data={posts}
                    style={{ paddingTop: 16, paddingBottom: 200 }}
                    keyExtractor={(item) => item.postID}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <PostCard post={item} />}
                />
            )}
        </View>
    );
}
