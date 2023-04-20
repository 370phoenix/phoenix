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
import UserDetails from "./UserDetails";

//NOTE: SHOULD THIS FILE BE HERE OR IN ANOTHER SECTION? THIS FILE IS IN THIS LOCATION TEMPORARILY

export default function UserList({
    riders,
    message,
    post,
}: {
    riders: UserInfo[];
    message: string | null;
    post: PostType;
}) {
    let i = 1;
    //const onSubmit = useState<string>;
    return (
        <View style={{ marginTop: riders.length > 0 ? 0 : 20 }}>
            {message && (
                <Text textStyle="label" style={{ color: Colors.red.p, textAlign: "center" }}>
                    {message}
                </Text>
            )}
            {riders.length > 0 &&
                riders.map((match) => {
                    return (
                        <View key={Math.random()}>
                            <UserDetails num={i++} user={match} post={post} />
                            <Spacer direction="column" size={32} />
                        </View>
                    );
                })}
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
