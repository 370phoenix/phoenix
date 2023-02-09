import { useState, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "./Themed";

export default function MatchButton() {
    // state variables for onClick event, change status of match and appearance of button
    const [status, setStatus] = useState('default');
    const [color, setColor] = useState("black");

    useEffect(() => {
        setColor(status === 'default'? "black" : "red");
    }, [status]);

    return (
        <Pressable
            onPress={() => {
                // TODO: update status variable in database
                setStatus(status === 'default' ? 'requested' : 'default');
            }}>
            <View style={styles.matchButton}>
                <Text style={[styles.buttonText, { color: color }]}>
                    {status === 'default' ? "Match!" : "Cancel Match"}
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
