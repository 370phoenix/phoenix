import * as Location from "expo-location";
import { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";

import { Button, Text } from "./Themed";
import Colors from "../constants/Colors";

export { Location };
export default function App({
    name,
    setLocation,
    inputText,
    onChangeText,
}: {
    name: string;
    setLocation: any;
    inputText: string;
    onChangeText: any;
}) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Access to Location denied");
            onChangeText(errorMsg);
        }

        let location: Location.LocationObject | null = await Location.getLastKnownPositionAsync();
        if (location == null) location = await Location.getCurrentPositionAsync();
        setLocation(location);

        const place = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });

        place.find((p) => {
            onChangeText(`${p.streetNumber} ${p.street}, ${p.city} ${p.region}, ${p.postalCode}`);
        });
    };

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
                clear
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
        borderBottomWidth: 1,
        padding: 8,
    },
    label: {
        marginBottom: 8,
    },
});
