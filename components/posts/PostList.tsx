import { useMachine } from "@xstate/react";
import { FlatList } from "react-native";

import { postListMachine } from "../../utils/machines/postListMachine";
import { View } from "../shared/Themed";
import auth from "@react-native-firebase/auth";
import FeedCard from "./FeedCard";

export default function PostList() {
    const [state, _] = useMachine(postListMachine);
    let { posts } = state.context;

    const user = auth().currentUser;
    // filter out matched posts from feed
    if (user) posts = posts.filter((post) => !post.riders?.includes(user.uid));

    return (
        <View style={{ marginTop: 20 }}>
            {posts && posts.length !== 0 && (
                <FlatList
                    data={posts}
                    style={{ paddingTop: 16, paddingBottom: 200 }}
                    keyExtractor={(item) => item.postID}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <FeedCard post={item} />}
                />
            )}
        </View>
    );
}
