import { useNavigation } from "@react-navigation/native";
import { User } from "firebase/auth/react-native";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { UserInfo } from "../utils/auth";
import { View, Text, Spacer, Button } from "./shared/Themed";

type Props = {
    user: User | null | undefined;
    userInfo: UserInfo | null;
    message: string | null;
};
export default function ProfileView({ user, userInfo, message }: Props) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {user && userInfo ? (
                <>
                    <ProfileInfo label="DISPLAY NAME:" value={userInfo.username} />
                    <Spacer direction="column" size={8} />
                    <ProfileInfo
                        label="CHILL INDEX:"
                        value={userInfo.chillIndex ? String(userInfo.chillIndex) : "none yet!"}
                    />
                    <Spacer direction="column" size={8} />
                    <ProfileInfo label="RIDES COMPLETED:" value={String(userInfo.ridesCompleted)} />
                    <Spacer direction="column" size={32} />
                    <Button
                        title="Change Account Info"
                        onPress={() =>
                            navigation.navigate("ChangeInfo", {
                                userInfo: userInfo,
                            })
                        }
                        color="navy"
                    />
                </>
            ) : (
                <Text textStyle="header" styleSize="s" style={{ color: Colors.navy.p }}>
                    {message}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.navy["4"],
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 8,
    },
});

type InfoProps = {
    label: string;
    value: string;
};
function ProfileInfo({ label, value }: InfoProps) {
    return (
        <View style={infoStyles.container}>
            <Text textStyle="lineTitle" styleSize="l" style={infoStyles.value}>
                {label}
            </Text>
            <Text textStyle="label" styleSize="l" style={infoStyles.value}>
                {value}
            </Text>
        </View>
    );
}

const infoStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 16,
        width: "100%",
    },
    value: {
        color: Colors.navy.p,
    },
});
