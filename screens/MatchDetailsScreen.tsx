import { StyleSheet, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { PostType } from "../constants/DataTypes";
import { Text, View, Spacer, Button } from "../components/Themed";
import Colors from "../constants/Colors";
import { RootStackParamList } from "../types";
import { getUserOnce, MessageType, UserInfo } from "../firebase/auth";
import { convertDate, convertLocation, convertTime } from "../firebase/ConvertPostTypes";
import ProfileInfo from "../components/ProfileInfo";

type Props = NativeStackScreenProps<RootStackParamList, "MatchDetails">;
export default function MatchDetailsScreen({ route }: Props) {
    const post = route.params?.post;

    return (
        <ScrollView directionalLockEnabled style={styles.container}>
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
            const objects = [];
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
        };

        loadUsers();
    }, [post]);

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
            {post.riders &&
                profiles &&
                profiles.map((profile, index) => (
                    <View key={index}>
                        <ProfileInfo userInfo={profile} />
                    </View>
                ))}
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
    container: {
        backgroundColor: Colors.gray[4],
        marginTop: -20,
        paddingTop: 20,
    },
    infoContainer: {
        paddingTop: 32,
        paddingHorizontal: 16,
    },
});
