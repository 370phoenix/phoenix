import SelectDropdown from "react-native-select-dropdown";

import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "./Themed";
import { Button } from "./Themed";

const numSeats = [2, 3, 4, 5];

export default function App({ label }: { label: string }) {
    const [select, onSelect] = useState(1);

    return (
        <View style={styles.dropdown}>
            <Text style={styles.label}>{label}</Text>
            <Button onPress={() => {}} title="pickNumber" color="navy">
            <SelectDropdown
                data={numSeats}
                onChangeSearchInputText={() => {}}
                defaultValue={select}
                onSelect={(selectedItem) => {
                    onSelect(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
            />
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        margin: 8,
        marginTop: 16,
        padding: 8,
    },
    label: {
        marginBottom: 16,
    },
});
