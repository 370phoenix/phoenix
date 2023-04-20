import { useContext } from "react";
import { useMachine, useSelector } from "@xstate/react";
import { FlatList } from "react-native";

import { postListMachine } from "../../utils/machines/postListMachine";
import { View } from "../shared/Themed";
import FeedCard from "./FeedCard";
import { AuthContext, userIDSelector } from "../../utils/machines/authMachine";

export default function PostList() {
    const authService = useContext(AuthContext);
    const [state, _] = useMachine(postListMachine);
    let { posts } = state.context;

    const userID = useSelector(authService, userIDSelector);
    // filter out matched posts from feed
    if (userID) posts = posts.filter((post) => post.user !== userID);
    else throw new Error("userID is undefined");

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
