import { SafeAreaView, StyleSheet, Text, View, Platform } from "react-native";
import React, { useState } from "react";
import { Button } from "./Themed";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
    const dateToString = (tempDate: Date): string => {
        let fDate =
            tempDate.getMonth() + 1 + "/" + tempDate.getDate() + "/" + tempDate.getFullYear();
        let fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
        return fDate + "\n" + fTime;
    };

    const [date, setDate] = useState(new Date());
    const [text, setText] = useState(dateToString(new Date()));

    const onChange = (event: any, selectedDate?: Date | undefined) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        setText(dateToString(tempDate));
    };

    return (
        <View style={styles.container}>
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"date"}
                is24Hour={false}
                display={"default"}
                onChange={onChange}
            />
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"time"}
                is24Hour={false}
                display={"default"}
                onChange={onChange}
            />
            <Text>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 500,
        flex: 1,
        padding: 6,
        alignItems: "center",
        backgroundColor: "white",
    },

    text: {
        fontSize: 25,
        color: "red",
        padding: 3,
        marginBottom: 10,
        textAlign: "center",
    },

    // Style for iOS ONLY...
    datePicker: {
        justifyContent: "center",
        alignItems: "flex-start",
        width: 320,
        height: 260,
        display: "flex",
    },
});
