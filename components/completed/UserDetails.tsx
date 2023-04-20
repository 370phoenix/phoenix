/* eslint-disable react-hooks/rules-of-hooks */
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { firebase } from "@react-native-firebase/database";

import { View, Text, Spacer, Button, TextArea } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { UserInfo } from "../../utils/userValidation";
import { PostType } from "../../utils/postValidation";

export default function UserDetails({
    user,
    post,
}: {
    user: UserInfo;
    num: number;
    post: PostType;
}) {
    const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

    const userID = user.userID;
    const postID = post.postID;

    const rnsRef = db.ref("noShow").child(userID).child(postID);

    const [title, setTitle] = useState("REPORT NO SHOW");

    const onSubmit = async () => {
        setTitle("REPORTED");
        rnsRef.set(true);
    };

    return (
        <View>
            <Text textStyle="header">{user.username}</Text>
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
