import { StyleSheet, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { PostID, PostType } from "../constants/DataTypes";
import { Text, View, Spacer, Button } from "../components/Themed";
import Colors from "../constants/Colors";
import MatchList from "../components/MatchList";
import { getAuth } from "firebase/auth/react-native";
import { fetchPost } from "../firebase/fetchPosts";
import { RootStackParamList } from "../types";
import { getUserOnce, MessageType, UserInfo } from "../firebase/auth";
import { convertDate, convertLocation, convertTime } from "../firebase/ConvertPostTypes";
import ProfileInfo from "../components/ProfileInfo";

type Props = NativeStackScreenProps<RootStackParamList, "MatchDetails">;
export default function MatchesModal({ route }: Props) {
    const [message, setMessage] = useState<string | null>(null);

    const post = route.params?.post

    return (
        <ScrollView directionalLockEnabled style={styles.container}>
            {message && (
                <Text textStyle="label" style={{ color: Colors.red.p, textAlign: "center" }}>
                    {message}
                </Text>
            )}
            {post && <MoreInfo post={post} />}
        </ScrollView>
    );
}

function MoreInfo({ post }: { post: PostType }) {
    const [matched, setMatched] = useState(true);
    const [profiles, setProfiles] = useState<UserInfo[] | null>(null);
    const onChangeMatched = () => setMatched(!matched);

    useEffect(() => {
        const loadUsers = async () => {
            const objects = []
            if (post.riders) {
                for (const rider of post.riders) {
                    const res = await getUserOnce(rider);
                    if (res.type === MessageType.success && res.data) objects.push(res.data);
                    else {
                        // TODO: error handling
                    }
                }
            }

            setProfiles(objects);
        }

        loadUsers();
    }, [post])

    return (
        <View style={styles.infoContainer}>
            <Text textStyle="header">Ride Information</Text>
            <Spacer direction="column" size={16} />
            <Text textStyle="label">
                {convertLocation(post.pickup)} {"->"} {convertLocation(post.dropoff)}
            </Text>
            <Text>{convertDate(post.startTime)}</Text>
            <Text>
                {convertTime(post.startTime)} - {convertTime(post.endTime)}
            </Text>
            <Spacer direction="column" size={16} />
            <Text textStyle="label">{post.roundTrip ? "Round trip" : "One way"}</Text>
            <Spacer direction="column" size={16} />
            <Text>Notes: {post.notes}</Text>
            <Spacer direction="column" size={40} />
            <Text textStyle="header">Rider Profiles</Text>
            <Spacer direction="column" size={16} />
            {post.riders && profiles && profiles.map((profile, index) => <ProfileInfo userInfo={profile} key={String(Math.random())} />)}
            <Spacer direction="column" size={40} />
            <Button
                title={matched ? "Unmatch" : "Rematch"}
                onPress={onChangeMatched}
                color={matched ? "red" : "purple"}
            />
            <Spacer direction="column" size={800} />
        </View>
    );
}



const styles = StyleSheet.create({
    modalView: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: Colors.gray.w,
        padding: 32,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    background: {
        width: "100%",
        height: 96,
    },
    container: {
        backgroundColor: Colors.gray[4],
    },
    infoContainer: {
        paddingTop: 32,
        paddingHorizontal: 16,
    },
});