import { useNavigation } from "@react-navigation/native";
import { User } from "firebase/auth/react-native";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { getUserUpdates, MessageType, UserInfo } from "../firebase/auth";
import { View, Text, Spacer, Button } from "./Themed";

type props = {
    user: User | null | undefined;
};
export default function ProfileView({ user }: props) {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [message, setMessage] = useState("Loading user info...");

    const navigation = useNavigation();

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
