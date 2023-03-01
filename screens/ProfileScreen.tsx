import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import PostList from "../components/PostList";
import ProfilePostList from "../components/ProfilePostList";
import ProfileView from "../components/ProfileView";

import { Spacer, View } from "../components/shared/Themed";
import Colors from "../constants/Colors";
import { AuthContext, getUserUpdates, MessageType, UserInfo } from "../utils/auth";
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
                const res = await getUserUpdates(user, (data: UserInfo) => {
                    setUserInfo(data);
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
