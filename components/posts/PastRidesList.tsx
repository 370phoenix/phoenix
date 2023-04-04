import { useMachine } from "@xstate/react";
import { FlatList } from "react-native";

import { UserID } from "../../constants/DataTypes";
import PostCard from "./PostCard";
import MatchCard from "../matches/MatchCard";
import PastPostsCard from "./PastPostsCard";
import { postListMachine } from "../../utils/machines/postListMachine";
import { View, Text } from "../shared/Themed";
import { AuthContext, userInfoSelector } from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";
import { useContext } from "react";

type Props = {
    userID: UserID;
};

export default function PastRidesList({ userID }: Props) {
    const authService = useContext(AuthContext);
    const userInfo = useSelector(authService, userInfoSelector);

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
