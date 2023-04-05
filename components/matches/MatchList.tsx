import { useContext } from "react";
import { FlatList, StyleSheet } from "react-native";

import MatchCard from "./MatchCard";
import RequestCard from "./RequestCard";
import { View, Text } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { PostType, UserID } from "../../constants/DataTypes";
import { AuthContext, userInfoSelector, userPostsSelector } from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";
import PendingCard from "./PendingCard";
import MatchCardWrapper from "./MatchCardWrapper";

type Props = {
    userID: UserID;
};
export default function MatchList({ userID }: Props) {
    const authService = useContext(AuthContext);
    const userInfo = useSelector(authService, userInfoSelector);
    const userPosts = useSelector(authService, userPostsSelector) ?? [];

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

    const { pending, matches } = userInfo;

    const requests: [PostType, string][] = [];
    for (const post of userPosts) {
        if (post.pending)
            requests.push(...post.pending.map((userID) => [post, userID] as [PostType, string]));
    }

    return (
        <View style={{ marginTop: 20 }}>
            <Text textStyle="header" styleSize="l" style={styles.title}>
                Requests
            </Text>
            <FlatList
                data={requests}
                scrollEnabled={false}
                style={{ borderBottomWidth: 1, marginBottom: 16, marginTop: 8 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    return (
                        <RequestCard
                            post={item[0]}
                            requesterID={item[1]}
                            userInfo={userInfo}
                            posterID={userID}
                        />
                    );
                }}
            />
            <Text textStyle="header" styleSize="l" style={styles.title}>
                Matches
            </Text>
            <FlatList
                scrollEnabled={false}
                data={userPosts}
                style={{ borderBottomWidth: 1, marginBottom: 16, marginTop: 8 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    return <MatchCard post={item} userID={userID} />;
                }}
            />
            <FlatList
                scrollEnabled={false}
                data={matches}
                style={{ borderBottomWidth: 1, marginBottom: 16, marginTop: 8 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    return <MatchCardWrapper postID={item} userID={userID} />;
                }}
            />
            <Text textStyle="header" styleSize="l" style={styles.title}>
                Pending
            </Text>
            <FlatList
                scrollEnabled={false}
                data={pending}
                style={{ borderBottomWidth: 1, marginBottom: 16, marginTop: 8 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    return <PendingCard postID={item} />;
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        paddingHorizontal: 16,
        paddingVertical: 0,
        marginBottom: 0,
        marginTop: 8,
        color: Colors.gray[1],
    },
});

export enum MatchSublist {
    pending,
    matches,
}
