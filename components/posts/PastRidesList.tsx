import { FlatList } from "react-native";

import PastPostsCard from "./PastPostsCard";
import { View, Text } from "../shared/Themed";
import { AuthContext, userIDSelector, userInfoSelector } from "../../utils/machines/authMachine";
import { useMachine, useSelector } from "@xstate/react";
import { useContext } from "react";
import { multipleCompletedMachine } from "../../utils/machines/multipleCompletedMachine";

export default function PastRidesList() {
    const authService = useContext(AuthContext);
    const userInfo = useSelector(authService, userInfoSelector);

    if (!userInfo) {
        console.error("No user info found");
        return <></>;
    }

    const { completed } = userInfo;
    const [state, send] = useMachine(multipleCompletedMachine);
    const { posts } = state.context;
    console.log(state.context);

    if (state.matches("Start")) {
        send({ type: "LOAD", postIDs: completed ?? [] });
    }
    // if (state.matches("Posts Loaded")) {
    //     send({ type: "CLOSE" });
    // }

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

    return (
        <View style={{ marginTop: 20, marginBottom: 20 }}>
            {posts && posts.length !== 0 && (
                <FlatList
                    scrollEnabled={true}
                    data={posts}
                    style={{ borderBottomWidth: 1, marginBottom: 16, marginTop: 8 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return <PastPostsCard post={item} />;
                    }}
                />
            )}
        </View>
    );
}
