import React from "react";
import { View, Switch, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { Text } from "./Themed";

const App = ({
    label,
    isEnabled,
    setIsEnabled,
    toggleSwitch,
}: {
    label: string;
    isEnabled: boolean;
    setIsEnabled: any;
    toggleSwitch: any;
}) => {
    return (
        <View style={styles.switchContainer}>
            <Text style={styles.label}>{label}</Text>
            <Switch
                trackColor={{ false: Colors.navy.p, true: Colors.navy.p }}
                thumbColor={Colors.gray[5]}
                ios_backgroundColor={Colors.gray[5]}
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        marginBottom: 8,
    },
    switchContainer: {
        margin: 16,
    },
});

export default App;
