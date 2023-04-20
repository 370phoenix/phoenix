/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { View, Text, Spacer, Button, TextArea } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { FBPostType } from "../../utils/postValidation";
import { getDB } from "../../utils/db";
import { useMachine } from "@xstate/react";
import { usernameMachine } from "../../utils/machines/usernameMachine";

interface Props {
    userID: string;
    num: number;
    post: FBPostType;
}
export default function UserDetails({ userID, post }: Props) {
    const { postID } = post;

    const [title, setTitle] = useState("REPORT NO SHOW");
    const [error, setError] = useState<Error | null>(null);

    const [state, send] = useMachine(usernameMachine);
    if (state.matches("Start")) send({ type: "LOAD", id: userID });

    const { username } = state.context;

    const onSubmit = async () => {
        try {
            setTitle("REPORTED");
            const rnsRef = getDB().ref("noShow").child(userID).child(postID);
            await rnsRef.set(true);
        } catch (e: any) {
            setError(e);
        }
    };

    return (
        <View>
            <Text textStyle="header">{username}</Text>
            <Spacer direction="row" size={16} />
            <Button title={title} onPress={onSubmit} color="purple" />
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        width: "100%",
    },
    container: {
        backgroundColor: Colors.gray[4],
        paddingHorizontal: 32,
    },
    infoContainer: {
        flex: 1,
    },
    footer: {
        backgroundColor: Colors.gray[4],
        height: 80,
        padding: 16,
    },
});
