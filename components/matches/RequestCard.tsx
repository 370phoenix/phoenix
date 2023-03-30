import { StyleSheet, Pressable, Alert } from "react-native";

import { View, Text } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { UserInfo } from "../../utils/auth";
import Accept from "../../assets/icons/Accept";
import Reject from "../../assets/icons/Reject";
import { PostType, UserID } from "../../constants/DataTypes";
import { useMachine } from "@xstate/react";
import { requestCardMachine } from "../../utils/machines/requestCardMachine";

export type Props = {
    requesterID: UserID;
    posterID: UserID;
    userInfo: UserInfo | null;
    post: PostType;
};
export default function RequestCard({ requesterID, posterID, post, userInfo }: Props) {
    const [state, send] = useMachine(requestCardMachine);
    const { requesterInfo } = state.context;
    let shouldRender = true;

    if (state.matches("Start")) send("LOAD INFO", { id: requesterID });

    const handleButton = (isAccept: boolean) => {
        Alert.alert(
            "Confirm?",
            `Are you sure you would like to ${isAccept ? "accept" : "reject"} this rider?`,
            [
                {
                    text: "Confirm",
                    onPress: () => {
                        send(isAccept ? "ACCEPT" : "REJECT", { post, posterID, userInfo });
                        shouldRender = false;
                        // TODO: Send notification to alert requester of accepted/rejected ride
                        // TODO: If accept, notification to alert matched riders of new match
                    },
                },
                {
                    text: "Cancel",
                },
            ]
        );
    };

    if (!shouldRender) return <></>;

    if (["Start", "Loading"].some(state.matches))
        return (
            <View style={styles.cardContainer}>
                <Text textStyle="header" styleSize="m" style={styles.name}>
                    Loading...
                </Text>
            </View>
        );

    return (
        <View style={styles.cardContainer}>
            <View style={styles.textPart}>
                {requesterInfo ? (
                    <>
                        <View style={styles.headerContainer}>
                            <Text textStyle="header" styleSize="m" style={styles.name}>
                                {requesterInfo.username}
                            </Text>
                            <Text textStyle="label" style={styles.subtext}>
                                {requesterInfo.pronouns}
                            </Text>
                        </View>

                        <Text textStyle="body" styleSize="m">
                            {requesterInfo.major} {requesterInfo.gradYear}
                        </Text>
                    </>
                ) : (
                    <Text>No Info.</Text>
                )}
            </View>

            <AcceptDenyButton
                isAccept={false}
                handleAction={() => {
                    handleButton(false);
                }}
            />
            <AcceptDenyButton isAccept={true} handleAction={() => handleButton(true)} />
        </View>
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
        backgroundColor: Colors.gray.w,
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
