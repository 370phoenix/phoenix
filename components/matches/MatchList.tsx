import { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";

import RequestCard from "./RequestCard";
import MatchCard from "./MatchCard";
import { View, Text } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { PostID, UserID } from "../../constants/DataTypes";
import { getUserUpdates, MessageType, UserInfo } from "../../utils/auth";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

type Props = {
    userID: UserID;
};
export default function MatchList({ userID }: Props) {
    const [isLoading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [requests, setRequests] = useState<[UserID, PostID][] | null>(null);
    const [matches, setMatches] = useState<PostID[] | null>(null);
    const [pending, setPending] = useState<PostID[] | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        loadUserInfo()
            .then((unsub) => {
                return unsub;
            })
            .catch((e) => setMessage(e.message));
    }, []);

    // Update the arrays with info from user
    useEffect(() => {
        updateArrrays();
    }, [userInfo]);

    const updateArrrays = () => {
        if (!userInfo) return;
        setLoading(true);

        // Posts this user has matched on
        let m = userInfo.matches ? userInfo.matches : [];
        // Posts this user has made
        const userPosts = userInfo.posts ? userInfo.posts : [];
        m = [...m, ...userPosts];
        // Posts waiting for a response
        const p = userInfo.pending ? userInfo.pending : [];
        const r = userInfo.requests ? userInfo.requests : [];

        setMatches(m);
        setPending(p);
        setRequests(r);
        setLoading(false);
    };

    // Load the user info for the current user
    const loadUserInfo = async () => {
        const res = await getUserUpdates(userID, (data) => {
            setUserInfo(data);
        });
        if (typeof res === "string") setMessage(res);
        else return res;
    };

    if (!isLoading) {
        return (
            <View style={{ marginTop: 20 }}>
                <Text textStyle="header" styleSize="l" style={styles.title}>
                    Requests
                </Text>
                <FlatList
                    scrollEnabled={false}
                    data={requests}
                    style={{ borderBottomWidth: 1, marginBottom: 16, marginTop: 8 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <RequestCard
                            requesterID={item[0]}
                            postID={item[1]}
                            userInfo={userInfo}
                            posterID={userID}
                        />
                    )}
                />
                <Text textStyle="header" styleSize="l" style={styles.title}>
                    Matches
                </Text>
                <FlatList
                    scrollEnabled={false}
                    data={matches}
                    style={{ borderBottomWidth: 1, marginBottom: 16, marginTop: 8 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <MatchCard
                                postID={item}
                                userInfo={userInfo}
                                list={MatchSublist.matches}
                            />
                        );
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
                        return (
                            <MatchCard
                                postID={item}
                                userInfo={userInfo}
                                list={MatchSublist.pending}
                            />
                        );
                    }}
                />
            </View>
        );
    } else
        return (
            <View style={{ marginTop: 0 }}>
                {
                    <Text style={{ color: "white" }} textStyle="title" styleSize="l">
                        Loading...
                    </Text>
                }
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
