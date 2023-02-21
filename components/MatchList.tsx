import { useState, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";

import PostCard from "./PostCard";
import MatchCard from "./MatchCard";
import { View, Text } from "./Themed";
import { fetchPosts } from "../firebase/fetchPosts";
import Colors from "../constants/Colors";
import matches from "../constants/MatchTestData.json"

export default function MatchList(){
    const [isLoading, setLoading] = useState(true);
    const [matches, setMatches] = useState<[string, any][]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isMatch, setIsMatch] = useState(true);


if(isMatch) {
    return (
        <View style={{ marginTop: 20}}>
            <FlatList
                data={matches}
                style={{ paddingTop: 16 }}
                //refreshControl={
                //    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                //}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <MatchCard post={item[1]} />}
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