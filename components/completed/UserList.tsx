/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

import { View, Text, Spacer } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { UserInfo } from "../../utils/userValidation";
import { PostType } from "../../utils/postValidation";
import UserDetails from "./UserDetails";

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
