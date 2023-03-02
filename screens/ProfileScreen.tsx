import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import ProfilePostList from "../components/profile/ProfilePostList";
import ProfileView from "../components/profile/ProfileView";

import { Spacer, View } from "../components/shared/Themed";
import Colors from "../constants/Colors";
import { getUserUpdates, MessageType, UserInfo } from "../utils/auth";
import { RootTabParamList } from "../types";
import auth from "@react-native-firebase/auth";

type props = BottomTabScreenProps<RootTabParamList, "Profile">;
export default function ProfileScreen({ navigation }: props) {
    const user = auth().currentUser;
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [message, setMessage] = useState("Loading user info...");

    useEffect(() => {
        if (user) {
            const res = getUserUpdates(user, (data: UserInfo) => {
                setUserInfo(data);
            });

            if (res.type === MessageType.error) {
                setMessage(res.message);
                return;
            }

            const unsubscribe = res.data;
            return () => unsubscribe();
        } else {
            setMessage("No user found");
        }
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
