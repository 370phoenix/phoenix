import { useState, useEffect } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";

import MatchCard from "./MatchCard";
import { View, Text } from "./Themed";
import Colors from "../constants/Colors";
import { PostID, UserID } from "../constants/DataTypes";
import { getUserOnce, MessageType, UserInfo } from "../firebase/auth";
import { User } from "firebase/auth/react-native";

type Props = {
    user: User;
};
export default function MatchList({ user }: Props) {
    const [isLoading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [requests, setRequests] = useState<[UserID] | null>(null);
    const [matches, setMatches] = useState<[PostID] | null>(null);
    const [pending, setPending] = useState<[PostID] | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        loadUserInfo();
    }, [user]);

    // Update the arrays with info from user
    useEffect(() => {
        if (!userInfo) return;

        const p = userInfo.pending ? userInfo.pending : [];
    }, [userInfo]);

    // Load the user info for the current user
    const loadUserInfo = async () => {
        const res = await getUserOnce(user);
        if (res.type !== MessageType.success) setMessage(res.message);
        else if (!res.data) setMessage("Could not locate user data.");
        else setUserInfo(res.data);
    };

    if (!isLoading) {
        return (
            <View style={{ marginTop: 20 }}>
                <Text textStyle="title" styleSize="l" style={styles.title}>
                    Requests{" "}
                </Text>
                <FlatList
                    data={posts}
                    style={{ paddingTop: 16 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <MatchCard user={item[1]} />}
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
