import { StyleSheet, Pressable, Platform, Alert } from "react-native";

import { View, Text, Spacer } from "./Themed";
import Colors from "../constants/Colors";
import { Button } from "./Themed";
import { useEffect, useState } from "react";
import { getUserOnce, MessageType, UserInfo, writeUser } from "../firebase/auth";
import Accept from "../assets/icons/Accept";
import Reject from "../assets/icons/Reject";
import { PostID, UserID } from "../constants/DataTypes";
import { handleAcceptReject, writePostData } from "../firebase/makePosts";
import { fetchPost } from "../firebase/fetchPosts";

export type Props = {
    requesterID: UserID;
    posterID: UserID;
    postID: string;
    userInfo: UserInfo | null;
};
export default function RequestCard({ requesterID, posterID, postID, userInfo }: Props) {
    //const name = userID.username;
    const [gender, setGender] = useState<string | null>(null);
    const [gradYear, setYear] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [major, setMajor] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        loadInfo();
    }, [requesterID]);

    const handleButton = async (isAccept: boolean) => {
        Alert.alert(
            "Confirm?",
            `Are you sure you would like to ${isAccept ? "accept" : "reject"} this rider?`,
            [
                {
                    text: "Confirm",
                    onPress: () =>
                        handleAcceptReject({
                            isAccept,
                            userInfo,
                            requesterID,
                            postID,
                            posterID,
                        }),
                },
                {
                    text: "Cancel",
                },
            ]
        );
    };

    const loadInfo = async () => {
        const res = await getUserOnce(requesterID);
        if (res.type !== MessageType.success) setMessage(res.message);
        else {
            const userInfo = res.data;
            if (
                !userInfo ||
                !userInfo.gender ||
                !userInfo.username ||
                !userInfo.major ||
                !userInfo.gradYear
            ) {
                setMessage("Couldn't find user information.");
                return;
            }
            setGender(userInfo.gender);
            setName(userInfo.username);
            setMajor(userInfo.major);
            setYear("'" + String(userInfo.gradYear).slice(2, 4));
        }
    };

    return (
        <Pressable
            //navigate to post onPress={() => }
            style={({ pressed }) => [
                styles.cardContainer,
                {
                    backgroundColor: pressed ? Colors.gray[4] : Colors.gray.w,
                },
            ]}>
            <View style={styles.textPart}>
                <View style={styles.headerContainer}>
                    <Text textStyle="header" styleSize="m" style={styles.name}>
                        {name}
                    </Text>
                    <Text textStyle="label" style={styles.subtext}>
                        {gender}
                    </Text>
                </View>

                <Text textStyle="body" styleSize="m">
                    {major} {gradYear}
                </Text>
            </View>
            <AcceptDenyButton
                isAccept={false}
                handleAction={() => {
                    handleButton(false);
                }}
            />
            <AcceptDenyButton isAccept={true} handleAction={() => handleButton(true)} />
        </Pressable>
    );
}

type ADProps = {
    isAccept: boolean;
    handleAction: (isAccept: boolean) => void;
};
function AcceptDenyButton({ isAccept, handleAction }: ADProps) {
    const props = {
        color: isAccept ? Colors.green.p : Colors.red.p,
        width: 40,
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    opacity: pressed ? 0.5 : 1,
                },
            ]}
            onPress={() => handleAction(isAccept)}>
            {isAccept ? <Accept {...props} /> : <Reject {...props} />}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        paddingLeft: 16,
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
    },
    body: { flex: 1 },
    riderIndicator: { justifyContent: "center", alignItems: "center", height: 25 },
    name: {
        color: Colors.purple.p,
        marginRight: 8,
    },
    subtext: {
        color: Colors.gray[2],
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        borderLeftWidth: 1,
        height: "100%",
    },
    textPart: { flex: 1, paddingVertical: 16 },
});
