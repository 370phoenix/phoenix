import React, { useState } from "react";
import { View, Switch, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { Text } from "./Themed";

const App = ({ label }: { label: string }) => {
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

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
        marginBottom: 8
    },
    switchContainer : {
        margin: 16
    },
});

export default App;
