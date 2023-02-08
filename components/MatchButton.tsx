import { useState, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "./Themed";

export default function MatchButton() {
    const [requested, setRequested] = useState(false);
    const [color, setColor] = useState("black");

    useEffect(() => {
        setColor(requested ? "red" : "black");
    }, [requested]);

    return (
        <Pressable
            onPress={() => {
                // TODO: update isRequested variable in database
                setRequested(requested ? false : true);
            }}>
            <View style={styles.matchButton}>
                <Text style={[styles.buttonText, { color: color }]}>
                    {!requested ? "Match!" : "Cancel Match"}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 16,
        textAlign: "center",
    },
    matchButton: {
        padding: 16,
        paddingRight: 64,
        paddingLeft: 64,
        margin: 8,
        borderRadius: 8,
        backgroundColor: "white",
        width: "95%",
    },
});
