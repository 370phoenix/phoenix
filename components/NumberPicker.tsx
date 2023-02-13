import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "./Themed";

// Component for number pickers
export default function App({ label, input }: { label: string; input: any[] }) {
    const [select, setSelect] = useState<{ name: string; value: number } | null>(null);

    const onChange = (selectedItem: any) => {
        setSelect(selectedItem.value);
    };
    return (
        <View style={styles.dropdown}>
            <Text style={styles.label}>{label}</Text>
            <Dropdown
                labelField="name"
                valueField="value"
                data={input}
                onChange={onChange}
                value={input[0].value} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        margin: 8,
        marginTop: 16,
        marginBottom: 0,
        padding: 8,
    },
    label: {
        marginBottom: 8,
    },
});
