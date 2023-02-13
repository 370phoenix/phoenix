import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";

import { Button } from "./Themed";

export default function MatchButton() {
    // state variables for onClick event, change status of match and appearance of button
    const [status, setStatus] = useState("default");
    const [color, setColor] = useState("black");

    useEffect(() => {
        setColor(status === "default" ? "black" : "red");
    }, [status]);

    return (
        // TODO: Update status in database
        <Button
            title={status === "default" ? "Match!" : "Cancel Match"}
            onPress={() => setStatus(status === "default" ? "requested" : "default")}
            color="purple"
            light
        />
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
