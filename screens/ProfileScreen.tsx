import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import PostList from "../components/PostList";
import ProfilePostList from "../components/ProfilePostList";
import ProfileView from "../components/ProfileView";

import { Spacer, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { AuthContext, getUserUpdates, MessageType, UserInfo } from "../firebase/auth";
import { RootTabParamList } from "../types";

type props = BottomTabScreenProps<RootTabParamList, "Profile">;
export default function ProfileScreen({ navigation }: props) {
    const authState = useContext(AuthContext);
    const user = authState?.user;
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [message, setMessage] = useState("Loading user info...");

    useEffect(() => {
        const setUpdates = async () => {
            if (user) {
                const res = await getUserUpdates(user, (data: any) => {
                    if (data.username && data.phone && data.gradYear && data.major && data.gender) {
                        setUserInfo({
                            username: data.username,
                            phone: data.phone,
                            gradYear: data.gradYear,
                            major: data.major,
                            gender: data.gender,
                            ridesCompleted: data.ridesCompleted ? data.ridesCompleted : 0,
                            chillIndex: data.chillIndex ? data.chillIndex : null,
                            posts: data.posts,
                            pending: data.pending,
                            matches: data.matches,
                        });
                    }
                });

                if (res.type === MessageType.error) setMessage(res.message);
            } else {
                setMessage("No user found");
            }
        };

        setUpdates();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <ProfileView user={user} userInfo={userInfo} message={message} />
                <Spacer direction="column" size={16} />
                <ProfilePostList userInfo={userInfo} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: -20,
        backgroundColor: Colors.purple.m,
    },
    body: {
        marginTop: 30,
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
    },
});
