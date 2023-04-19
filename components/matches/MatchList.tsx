import { useContext, useEffect } from "react";
import { FlatList, StyleSheet, ScrollView } from "react-native";

import MatchCard from "./MatchCard";
import RequestCard from "./RequestCard";
import { View, Text } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { AuthContext, userInfoSelector, userPostsSelector } from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";
import * as Notifications from "expo-notifications";
import PendingCard from "./PendingCard";
import MatchCardWrapper from "./MatchCardWrapper";
import { PostType } from "../../utils/postValidation";

type Props = {
    userID: string;
};

export default function MatchList({ userID }: Props) {
    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(
            (notification: Notifications.Notification) => {
                console.log(notification);
            }
        );
        return () => subscription.remove();
    }, []);

    const authService = useContext(AuthContext);
    const userInfo = useSelector(authService, userInfoSelector);
    const userPosts = useSelector(authService, userPostsSelector) ?? [];

    if (!userInfo)
        return (
            <View style={{ marginTop: 0 }}>
                <Text style={{ color: "white" }} textStyle="title" styleSize="l">
                    Loading...
                </Text>
            </View>
        );

    const { pending, matches } = userInfo;

    const requests: [PostType, string][] = [];
    for (const post of userPosts) {
        if (post.pending)
            requests.push(
                ...Object.keys(post.pending).map((userID) => [post, userID] as [PostType, string])
            );
    }

    return (
        <ScrollView style={{ marginTop: 20, height: "100%" }}>
            <Text textStyle="header" styleSize="l" style={[styles.title, { marginTop: 20 }]}>
                Requests
            </Text>
            <FlatList
                data={requests}
                scrollEnabled={false}
                style={styles.list}
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
                style={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    return <MatchCard post={item} userID={userID} />;
                }}
            />
            <FlatList
                scrollEnabled={false}
                data={matches ? Object.keys(matches) : []}
                style={styles.list}
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
                data={pending ? Object.keys(pending) : []}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    return <PendingCard postID={item} />;
                }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        paddingHorizontal: 16,
        paddingVertical: 0,
        marginBottom: 0,
        color: Colors.gray[4],
    },
    list: {
        marginVertical: 8,
    },
});

export enum MatchSublist {
    pending,
    matches,
}
