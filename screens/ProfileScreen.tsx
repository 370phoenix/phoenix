import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useContext } from "react";
import { StyleSheet, ScrollView } from "react-native";
import ProfilePostList from "../components/profile/ProfilePostList";
import ProfileView from "../components/profile/ProfileView";

import { Spacer, View } from "../components/shared/Themed";
import Colors from "../constants/Colors";
import { RootTabParamList } from "../types";
import { useSelector } from "@xstate/react";
import { AuthContext, userInfoSelector } from "../utils/machines/authMachine";

type props = BottomTabScreenProps<RootTabParamList, "Profile">;
export default function ProfileScreen({}: props) {
    const authService = useContext(AuthContext);
    const userInfo = useSelector(authService, userInfoSelector);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                <ProfileView userInfo={userInfo} />
                <Spacer direction="column" size={16} />
                <ProfilePostList />
            </ScrollView>
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
