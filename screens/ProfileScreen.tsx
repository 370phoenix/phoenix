import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import ProfileView from "../components/ProfileView";

import { View } from "../components/Themed";
import Colors from "../constants/Colors";
import { AuthContext } from "../firebase/auth";
import { RootTabParamList } from "../types";

type props = BottomTabScreenProps<RootTabParamList, "Profile">;
export default function ProfileScreen({ navigation }: props) {
    const authState = useContext(AuthContext);
    const user = authState?.user;
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <ProfileView user={user} />
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
        marginTop: 20,
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 8,
    },
});
