import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import Colors from "../constants/Colors";

import * as Location from "expo-location";
import { Button, Text } from "./Themed";

export default function App({ name }: { name: string }) {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [inputText, onChangeText] = React.useState("");

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Access to Location denied");
        }

        let location: Location.LocationObject | null = await Location.getLastKnownPositionAsync();
        if (location == null) location = await Location.getCurrentPositionAsync();
        setLocation(location);

        const place = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });

        place.find((p) => {
            onChangeText(`${p.streetNumber} ${p.street}\n${p.city} ${p.region}, ${p.postalCode}`);
        });
    };

    let text: string | null = "Waiting..";
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = inputText;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{name === "pickup" ? "From" : "To"}</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={inputText}
                placeholder={`${name} location`}
                placeholderTextColor={Colors.gray.b}
            />
            <Button
                title="Use Current Location"
                color="navy"
                clear={true}
                onPress={() => getLocation()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        marginLeft: 16,
        marginRight: 16,
    },
    input: {
        borderWidth: 1,
        padding: 8,
    },
    label: {
        marginBottom: 8,
    },
});
