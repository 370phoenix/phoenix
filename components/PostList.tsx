import { StyleSheet, ScrollView } from "react-native";
import { brandColors } from "../constants/Colors";
import PostCard from "./PostCard";
import ViewPostTest from "../constants/ViewPostTest";


export default function PostList() {
    return (
        <ScrollView style={styles.listContainer}>
            <PostCard post={ViewPostTest[0]}></PostCard>
            <PostCard post={ViewPostTest[1]}></PostCard>
            <PostCard post={ViewPostTest[2]}></PostCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 24,
        backgroundColor: brandColors.darkPurple,
    },
});
