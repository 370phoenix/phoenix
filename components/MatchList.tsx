import { useState, useEffect } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";

import PostCard from "./PostCard";
import MatchCard from "./MatchCard";
import { View, Text } from "./Themed";
import { fetchPosts, fetchUsers } from "../firebase/fetchPosts";
import Colors from "../constants/Colors";
import matches from "../constants/MatchTestData.json";


export default function MatchList(){
    const [isLoading, setLoading] = useState(true);
    const [posts, setPosts] = useState<[string, any][]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isMatch, setIsMatch] = useState(true);
    const [users, setUsers] = useState<[string, any][]>([]);


    const fetchData = async () => {
        if ((posts.length === 0 && isLoading) || refreshing) {
            const res = await fetchPosts();
            if (typeof res !== "string") setPosts(Object.entries(res));
            setLoading(false);
        }
    };

    const fetchUserData = async () =>{
        const res = await fetchUsers();
        if (typeof res !== "string") setUsers(Object.entries(res));
    }

    // pull down to refresh, updates posts
    const onRefresh: any = async () => {
        setLoading(true);
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [posts, isLoading]);


if(isMatch) {
    return (
        <View style={{ marginTop: 20}}>
            <Text textStyle="title" styleSize="l" style={styles.title}>Requests </Text>
            <FlatList
                data={posts}
                style={{ paddingTop: 16 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <MatchCard user={item[1]} />}
                />
        </View>


    )

}
else
return (
    <View style={{ marginTop: 0}}>
        {
        <Text style={{ color: "white" }} textStyle="title" styleSize="l">
            No matches yet
        </Text>
        }   

    </View>
);
};


const styles = StyleSheet.create({
title: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    marginBottom: 0,
    marginTop: 8,
    color: Colors.gray[1]
}

})