import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import ProfilePostList from "../components/profile/ProfilePostList";
import ProfileView from "../components/profile/ProfileView";

import { Spacer, View } from "../components/shared/Themed";
import Colors from "../constants/Colors";
import { getUserUpdates, MessageType, UserInfo } from "../utils/auth";
import { RootTabParamList } from "../types";
import { useSelector } from "@xstate/react";
import { AuthContext, userIDSelector } from "../utils/machines";

type props = BottomTabScreenProps<RootTabParamList, "Profile">;
export default function ProfileScreen({ navigation }: props) {
    const authService = useContext(AuthContext);
    const userID = useSelector(authService, userIDSelector);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [message, setMessage] = useState("Loading user info...");

    useEffect(() => {
        if (userID) {
            const res = getUserUpdates(userID, (data: UserInfo) => {
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
                <ProfileView userInfo={userInfo} message={message} />
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
