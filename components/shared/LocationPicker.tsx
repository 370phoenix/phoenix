import * as Location from "expo-location";
import { View, StyleSheet, Pressable } from "react-native";

import { TextField, Text } from "./Themed";
import Colors from "../../constants/Colors";
import Alert from "../../assets/icons/Alert";
import { Coords } from "../../utils/postValidation";

interface LocationPickerProps {
    name: string;
    inputText: string;
    onChangeText: React.Dispatch<React.SetStateAction<string>>;
    addressError: boolean;
}
export default function LocationPicker({
    name,
    inputText,
    onChangeText,
    addressError,
}: LocationPickerProps) {
    return (
        <View style={styles.locationPicker}>
            <TextField
                style={{ flex: 1 }}
                label={name === "From" ? "" : "Destination"}
                textStyle={["body", "s"]}
                inputState={[inputText, onChangeText]}
                placeholder={`${name}`}
                placeholderTextColor={Colors.gray[2]}
            />
            {addressError && <Alert color={Colors.red.p} width={30} style={{ marginLeft: 8 }} />}
        </View>
    );
}

export function LocationButton({
    setLocation,
    onChangeText,
}: {
    setLocation: (coords: Coords) => void;
    onChangeText: (text: string) => void;
}) {
    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            onChangeText("Access to Location denied");
        }

        let location: Location.LocationObject | null = await Location.getLastKnownPositionAsync();
        if (location == null) location = await Location.getCurrentPositionAsync();
        const coords: Coords = { lat: location.coords.latitude, long: location.coords.longitude };
        setLocation(coords);

        const place = await Location.reverseGeocodeAsync({
            latitude: coords.lat,
            longitude: coords.long,
        });

        place.find((p) => {
            if (p.name !== null) {
                onChangeText(p.name);
            }
            onChangeText(`${p.streetNumber} ${p.street}, ${p.city} ${p.region}, ${p.postalCode}`);
        });
    };
    return (
        <Pressable
            style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}
            onPress={() => getLocation()}>
            <Text textStyle="lineTitle" style={styles.buttonText}>
                Use Current Location
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    locationPicker: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    button: {
        padding: 0,
        marginTop: -4,
        marginBottom: 4,
    },
    buttonText: {
        color: Colors.purple.p,
        textTransform: "uppercase",
    },
});
