import { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";

import RequestCard from "./RequestCard";
import MatchCard from "./MatchCard";
import { View, Text } from "./Themed";
import Colors from "../constants/Colors";
import { PostID, UserID } from "../constants/DataTypes";
import { getUserUpdates, MessageType, UserInfo } from "../firebase/auth";
import { User } from "firebase/auth/react-native";

type Props = {
    user: User;
};
export default function MatchList({ user }: Props) {
    const [isLoading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [requests, setRequests] = useState<[UserID, PostID][] | null>(null);
    const [matches, setMatches] = useState<PostID[] | null>(null);
    const [pending, setPending] = useState<PostID[] | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [userID, setUserID] = useState<string | null>(null);

    useEffect(() => {
        loadUserInfo()
            .then((unsub) => {
                return unsub;
            })
            .catch((e) => setMessage(e.message));
    }, [user]);

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
        const res = await getUserUpdates(user, (data) => {
            setUserInfo(data);
        });
        if (res.type === MessageType.error) setMessage(res.message);
        else return res.data;
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
                            posterID={user.uid}
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
                        return <MatchCard postID={item} userInfo={userInfo} />;
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
                        return <MatchCard postID={item} userInfo={userInfo} />;
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
