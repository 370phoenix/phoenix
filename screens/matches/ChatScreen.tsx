/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useRef } from "react";
import { StyleSheet, Animated, FlatList, View, Easing } from "react-native";
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
import { FBToPostSchema } from "../../utils/postValidation";

type Props = NativeStackScreenProps<RootStackParamList, "ChatScreen">;
export default function ChatScreen({ route, navigation }: Props) {
    const authService = useContext(AuthContext);
    const userID = useSelector(authService, userIDSelector);

    if (!userID || !route.params) return <></>;
    const { post: serializedPost, header } = route.params;
    const post = FBToPostSchema.parse(serializedPost);

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
                    onPress={() => {
                        if (state.can("CACHE AND LEAVE")) send({ type: "CACHE AND LEAVE" });
                        navigation.goBack();
                    }}
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
        <View style={styles.container}>
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.error} textStyle="body" styleSize="m">
                        {error.message}
                    </Text>
                </View>
            )}
            <Messages
                messages={messages}
                userID={userID}
                displayNames={header.displayNames}
                sendMessage={(message) => send({ type: "TRY MESSAGE", message })}
            />
        </View>
    );
}

type MessagesProps = {
    messages: ChatMessage[];
    userID: string;
    displayNames: { [key: string]: string };
    sendMessage: (message: ChatMessage) => void;
};
function Messages({ messages, userID, displayNames, sendMessage }: MessagesProps) {
    const listRef = useRef<FlatList<ChatMessage>>(null);

    return (
        <>
            <FlatList
                ref={listRef}
                alwaysBounceVertical={true}
                showsVerticalScrollIndicator={false}
                style={styles.messages}
                data={messages}
                renderItem={({ item }) => (
                    <Message message={item} userID={userID} displayNames={displayNames} />
                )}
            />
            <ChatInput
                scrollToEnd={() => {
                    if (!listRef.current) return;
                    const ref = listRef.current.getNativeScrollRef();
                    if (!ref) return;
                    if ("scrollToEnd" in ref && typeof ref.scrollToEnd === "function")
                        ref.scrollToEnd({ animated: true });
                }}
                userID={userID}
                sendMessage={sendMessage}
            />
        </>
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
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            easing: Easing.ease,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <Animated.View style={{ ...styles.messageRow, opacity: fadeAnim }}>
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
        </Animated.View>
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
    errorContainer: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
    },
    error: {
        color: Colors.red.p,
    },
});
