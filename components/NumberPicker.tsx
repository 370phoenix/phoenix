import { Dropdown } from "react-native-element-dropdown";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "./Themed";

// Component for number pickers
export default function App({
    label,
    input,
    onChange,
    selected,
}: {
    label: string;
    input: any[];
    onChange: any;
    selected: { label: string; value: number } | number;
}) {
    return (
        <View style={styles.dropdown}>
            <Text style={styles.label}>{label}</Text>
            <ScrollView>
                <Dropdown
                    labelField="name"
                    valueField="value"
                    data={input}
                    onChange={onChange}
                    value={selected}
                />
            </ScrollView>
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
