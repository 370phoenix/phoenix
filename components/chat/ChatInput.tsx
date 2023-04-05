import React, { useState } from "react";
import {
    Keyboard,
    TextInput,
    StyleSheet,
    LayoutAnimation,
    Platform,
    View,
    Pressable,
} from "react-native";

import { Text } from "../shared/Themed";
import Colors from "../../constants/Colors";
import { enableLayoutAnimation } from "../../utils/animation";
import useKeyboardHeight from "../../hooks/useKeyboardHeight";
import { ChatMessage } from "../../utils/chat";

type Props = {
    sendMessage: (message: ChatMessage) => void;
    userID: string;
};
export default function ChatInput({ sendMessage, userID }: Props) {
    enableLayoutAnimation();
    const [text, onChangeText] = useState("");
    const [margin, setMargin] = useState(20);
    const [focused, setFocused] = useState(false);
    const height = useKeyboardHeight();

    const onFocus = () => {
        setFocused(true);
        LayoutAnimation.configureNext(LayoutAnimation.create(200, "linear", "scaleXY"));
        setMargin(height);
        if (height === 0) setTimeout(() => Keyboard.dismiss(), 20);
    };
    const onBlur = () => {
        setFocused(false);
        LayoutAnimation.configureNext(LayoutAnimation.create(200, "linear", "scaleXY"));
        setMargin(20);
    };

    const onSend = () => {
        sendMessage({
            message: text,
            timestamp: new Date().getTime(),
            uid: userID,
        });
    };

    return (
        <View style={[styles.container, { marginBottom: Platform.OS === "android" ? 0 : margin }]}>
            <TextInput
                autoFocus={true}
                style={styles.input}
                placeholder="message"
                placeholderTextColor={Colors.gray[3]}
                value={text}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                keyboardType="default"
                inputMode="text"
            />
            {focused && <SendButton send={onSend} />}
        </View>
    );
}

type SendProps = { send: () => void };
function SendButton({ send }: SendProps) {
    return (
        <Pressable onPress={() => send()} style={styles.sendButton}>
            <Text textStyle="label" styleSize="m" style={styles.sendText}>
                Send
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        padding: 16,
    },
    container: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        borderColor: Colors.gray[2],
        borderWidth: 1,
        backgroundColor: Colors.gray.w,
    },
    sendButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        margin: 8,
        borderRadius: 999,
        backgroundColor: Colors.purple.p,
    },
    sendText: {
        color: Colors.gray.w,
    },
});
