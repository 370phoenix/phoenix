/* eslint-disable react-hooks/rules-of-hooks */
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";

import { View, Text, Spacer } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import { RootStackParamList } from "../../types";
import { useHeaderHeight } from "@react-navigation/elements";
import { AuthContext, userIDSelector } from "../../utils/machines/authMachine";
import { useSelector } from "@xstate/react";
import MoreInfo from "../../components/completed/MoreInfo";

type Props = NativeStackScreenProps<RootStackParamList, "PastPostDetails">;
export default function DetailsModal({ route }: Props) {
    if (!route.params) return <></>;
    const post = route.params.post;

    const [message, setMessage] = useState<string | null>(null);
    const authService = useContext(AuthContext);
    const userID = useSelector(authService, userIDSelector);

    return (
        <View style={styles.infoContainer}>
            <ScrollView directionalLockEnabled style={styles.container}>
                {message && (
                    <Text textStyle="label" style={{ color: Colors.red.p, textAlign: "center" }}>
                        {message}
                    </Text>
                )}

                {post && <MoreInfo post={post} />}
                <Spacer direction="column" size={32} />
            </ScrollView>
            <View
                style={{
                    backgroundColor: Colors.gray[4],
                    height: useHeaderHeight() + 16,
                    padding: 16,
                }}>
                <Spacer direction="column" size={24} />
            </View>
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
