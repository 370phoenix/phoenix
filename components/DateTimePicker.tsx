import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

import * as Location from "expo-location";

// Component returns current location as string for create post form
export default function App() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [locationString, setLocationString] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
            setLocationString(`Your current location: ${p.city} ${p.region}, ${p.postalCode}`);
        });
    };

    useEffect(() => {
        getLocation();
    }, []);

    let text: string | null = "Waiting..";
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = locationString;
    }

    return <Text style={styles.paragraph}>{text}</Text>;
}

const styles = StyleSheet.create({
    paragraph: {
        color: Colors.gray.b,
    },
});
