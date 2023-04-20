import { useContext, useRef } from "react";
import { StyleSheet, Pressable, Alert } from "react-native";

import { View, Text } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { UserInfo } from "../../utils/userValidation";
import Accept from "../../assets/icons/Accept";
import Reject from "../../assets/icons/Reject";
import { useMachine } from "@xstate/react";
import { getRequestCardMachine } from "../../utils/machines/requestCardMachine";
import { FBPostType, FBToPostSchema, PostToFBSchema, PostType } from "../../utils/postValidation";
import { AuthContext } from "../../utils/machines/authMachine";

export type Props = {
    requesterID: string;
    posterID: string;
    userInfo: UserInfo | null;
    post: PostType;
};
export default function RequestCard({ requesterID, posterID, post, userInfo }: Props) {
    const machine = useRef(getRequestCardMachine());
    const [state, send] = useMachine(machine.current);
    const authService = useContext(AuthContext);
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
                        const type = isAccept ? "ACCEPT" : "REJECT";
                        send(type, {
                            post: PostToFBSchema.parse(post),
                            posterID,
                            userInfo,
                            onSuccessful: (post: FBPostType) => {
                                authService.send("UPDATE POST", {
                                    post: FBToPostSchema.parse(post),
                                });
                            },
                            onError: (error: Error) => Alert.alert("Error", error.message),
                        });
                        shouldRender = false;
                    },
                },
                {
                    text: "Cancel",
                },
            ]
        );
    };

    if (!shouldRender) return <></>;

    if (!requesterInfo) return <></>;

    const textPart = ["Start", "Loading"].some(state.matches) ? (
        <Text textStyle="header" styleSize="m" style={styles.name}>
            Loading...
        </Text>
    ) : (
        <View style={styles.textPart}>
            <View style={styles.headerContainer}>
                <Text textStyle="header" styleSize="s" style={styles.name}>
                    {requesterInfo.username}
                </Text>
                <Text textStyle="body" styleSize="s" style={styles.subtext}>
                    {requesterInfo.pronouns}
                </Text>
            </View>

            <Text textStyle="body" styleSize="s">
                {requesterInfo.major} {requesterInfo.gradYear}
            </Text>
        </View>
    );

    return (
        <View style={styles.cardContainer}>
            {textPart}
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

    const pressedColor = isAccept ? Colors.green[3] : Colors.red[3];

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: pressed ? pressedColor : Colors.gray.w,
                },
            ]}
            onPress={() => handleAction(isAccept)}>
            {isAccept ? <Accept {...props} /> : <Reject {...props} />}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
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
        paddingVertical: 4,
        borderRadius: 8,
    },
    textPart: { flex: 1 },
});
