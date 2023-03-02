import * as Location from "expo-location";
import { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";

import { Button } from "./Themed";
import Colors from "../../constants/Colors";

export { Location };
export default function LocationPicker({
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
    return (
        <View>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={inputText}
                placeholder={`${name} location`}
                placeholderTextColor={Colors.gray.b}
            />
        </View>
    );
}

export function LocationButton({
    setLocation,
    inputText,
    onChangeText,
}: {
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
    return <Button title="Use Current Location" color="navy" clear onPress={() => getLocation()} />;
}

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        padding: 8,
    },
});
