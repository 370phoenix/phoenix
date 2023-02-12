import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

export default function App () {
    const [selectedValue, setSelectedValue] = useState("1");
    return (
        <View style={styles.container}>
            {/* <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}>
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
            </Picker> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 100
    },
});
