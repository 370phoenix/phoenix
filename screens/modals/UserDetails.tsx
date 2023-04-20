/* eslint-disable react-hooks/rules-of-hooks */
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { firebase } from "@react-native-firebase/database";

import { View, Text, Spacer, Button, TextArea } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { RootStackParamList } from "../../types";
import { UserInfo } from "../../utils/userValidation";
import { PostType } from "../../utils/postValidation";
import { useHeaderHeight } from "@react-navigation/elements";
import { AuthContext, userIDSelector, userInfoSelector } from "../../utils/machines/authMachine";
import { useMachine, useSelector } from "@xstate/react";
import { multipleUserMachine } from "../../utils/machines/multipleUserMachine";
import { pushFeedback } from "../../utils/feedback";
import MoreInfo from "./MoreInfo";
import UserList from "./UserList";

//NOTE: SHOULD THIS FILE BE HERE OR IN ANOTHER SECTION? THIS FILE IS IN THIS LOCATION TEMPORARILY

export default function UserDetails({
    user,
    num,
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
