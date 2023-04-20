/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

import { View, Text, Spacer } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { FBPostType } from "../../utils/postValidation";
import UserDetails from "./UserDetails";

export default function UserList({
    riders,
    message,
    post,
}: {
    riders: string[];
    message: string | null;
    post: FBPostType;
}) {
    return (
        <View style={{ marginTop: riders.length > 0 ? 0 : 20 }}>
            {message && (
                <Text textStyle="label" style={{ color: Colors.red.p, textAlign: "center" }}>
                    {message}
                </Text>
            )}
            {riders.length > 0 &&
                riders.map((match, index) => {
                    return (
                        <View key={index.toString()}>
                            <UserDetails num={index} userID={match} post={post} />
                            <Spacer direction="column" size={32} />
                        </View>
                    );
                })}
        </View>
    );
}
