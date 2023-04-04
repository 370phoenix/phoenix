import { FlatList } from "react-native";

import PastPostsCard from "./PastPostsCard";
import { View, Text } from "../shared/Themed";
import { AuthContext, userInfoSelector } from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";
import { useContext } from "react";

export default function PastRidesList() {
    const authService = useContext(AuthContext);
    const userInfo = useSelector(authService, userInfoSelector);
    const { userID } = userInfo;

    if (!userInfo)
        return (
            <View style={{ marginTop: 0 }}>
                {
                    <Text style={{ color: "white" }} textStyle="title" styleSize="l">
                        Loading...
                    </Text>
                }
            </View>
        );

    const { posts: userPosts } = userInfo;
    const completed = userPosts;
    //const list1: MatchSublist;

    return (
        <View style={{ marginTop: 20, marginBottom: 200 }}>
            {userPosts && userPosts.length !== 0 && (
                <FlatList
                    scrollEnabled={false}
                    data={completed}
                    style={{ borderBottomWidth: 1, marginBottom: 16, marginTop: 8 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return <PastPostsCard postID={item} userID={userID} />;
                    }}
                />
            )}
        </View>
    );
}
