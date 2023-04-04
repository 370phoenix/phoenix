import { FlatList } from "react-native";

import PastPostsCard from "./PastPostsCard";
import { View, Text } from "../shared/Themed";
import { AuthContext, userIDSelector, userInfoSelector } from "../../utils/machines/authMachine";
import { useMachine, useSelector } from "@xstate/react";
import { useContext } from "react";
import { multiplePostsMachine } from "../../utils/machines/multiplePostsMachine";

export default function PastRidesList() {
    const authService = useContext(AuthContext);
    const userInfo = useSelector(authService, userInfoSelector);

    if (!userInfo) {
        console.error("No user info found");
        return <></>;
    }

    const { completed } = userInfo;
    const [state, send] = useMachine(multiplePostsMachine);
    const { posts } = state.context;

    if (state.matches("Start")) {
        send({ type: "LOAD", postIDs: completed ?? [] });
    }

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
        <View style={{ marginTop: 20, marginBottom: 200 }}>
            {posts && posts.length !== 0 && (
                <FlatList
                    scrollEnabled={false}
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
