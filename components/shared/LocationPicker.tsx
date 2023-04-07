import * as Location from "expo-location";
import { useState } from "react";
import { View } from "react-native";

import { Button, TextField } from "./Themed";
import Colors from "../../constants/Colors";

export { Location };
export default function LocationPicker({
    name,
    inputText,
    onChangeText,
}: {
    name: string;
    inputText: string;
    onChangeText: any;
}) {
    return (
        <View>
            <TextField
                label={name === "From" ? "Pickup" : "Dropoff"}
                inputState={[inputText, onChangeText]}
                placeholder={`${name}`}
                placeholderTextColor={Colors.gray[2]}
            />
        </View>
    );
}

export function LocationButton({
    setLocation,
    onChangeText,
}: {
    setLocation: any;
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
        setLocation(location.coords.latitude, location.coords.longitude);

        const place = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });

        place.find((p) => {
            onChangeText(`${p.streetNumber} ${p.street}, ${p.city} ${p.region}, ${p.postalCode}`);
        });
    };
    return (
        <Button
            title="Use Current Location"
            color="navy"
            short
            clear
            onPress={() => getLocation()}
        />
    );
}
