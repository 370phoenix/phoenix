/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect } from "react";
import { StyleSheet, ScrollView, View, Pressable, Keyboard } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMachine, useSelector } from "@xstate/react";

import { Text, Button } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { Left } from "../../assets/icons/Chevron";

import { RootStackParamList } from "../../types";
import { AuthContext, userIDSelector } from "../../utils/machines/authMachine";
import { chatMachine } from "../../utils/machines/chatMachine";
import { ChatMessage } from "../../utils/chat";
import ChatInput from "../../components/chat/ChatInput";

type Props = NativeStackScreenProps<RootStackParamList, "ChatScreen">;
export default function ChatScreen({ route, navigation }: Props) {
    const authService = useContext(AuthContext);
    const userID = useSelector(authService, userIDSelector);

    if (!userID || !route.params) return <></>;
    const { post, header } = route.params;

    const [state, send] = useMachine(chatMachine);
    if (state.matches("Start")) send({ type: "CHECK CACHE", header, navigation, post, userID });
    const { messages, error } = state.context;

    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", () => {
            if (state.can("CACHE AND LEAVE")) send({ type: "CACHE AND LEAVE" });
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    title="Go back"
                    onPress={() => send({ type: "CACHE AND LEAVE" })}
                    leftIcon={Left}
                    color="purple"
                    light
                    short
                    clear
                />
            ),
        });
    }, []);

    return (
        <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
            <Messages messages={messages} userID={userID} displayNames={header.displayNames} />
            <ChatInput
                userID={userID}
                sendMessage={(message) => send({ type: "TRY MESSAGE", message })}
            />
        </Pressable>
    );
}

type MessagesProps = {
    messages: ChatMessage[];
    userID: string;
    displayNames: { [key: string]: string };
};
function Messages({ messages, userID, displayNames }: MessagesProps) {
    return (
        <ScrollView style={styles.messages}>
            {messages.length > 0 &&
                messages.map((message) => (
                    <Message
                        key={message.timestamp.toString()}
                        message={message}
                        userID={userID}
                        displayNames={displayNames}
                    />
                ))}
        </ScrollView>
    );
}

function Message({
    message,
    userID,
    displayNames,
}: {
    message: ChatMessage;
    userID: string;
    displayNames: { [key: string]: string };
}) {
    const isMine = userID === message.uid;
    return (
        <View style={styles.messageRow}>
            {isMine && <View style={{ flex: 1 }} />}
            <View style={styles.messageBubble}>
                {!isMine && (
                    <Text textStyle="label" styleSize="s" style={styles.displayName}>
                        {displayNames[message.uid]}
                    </Text>
                )}
                <View
                    style={[
                        styles.messageContainer,
                        isMine ? styles.myMessage : styles.yourMessage,
                    ]}>
                    <Text textStyle="body" styleSize="m" style={styles.text}>
                        {message.message}
                    </Text>
                </View>
            </View>
            {!isMine && <View style={{ flex: 1 }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    messages: {
        marginTop: 20,
        flex: 1,
    },
    messageRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginVertical: 8,
    },
    messageBubble: {
        justifyContent: "flex-start",
    },
    messageContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 4,
        shadowOpacity: 0.3,
        shadowColor: Colors.gray[1],
        elevation: 5,
    },
    displayName: {
        color: Colors.gray[2],
    },
    myMessage: {
        backgroundColor: Colors.purple[3],
    },
    yourMessage: {
        backgroundColor: Colors.gray[3],
    },
    text: {
        color: Colors.gray.b,
    },
});
