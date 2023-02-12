import { SafeAreaView, StyleSheet, Text, View, Platform } from "react-native";
import React, { useState } from "react";
import { Button } from "./Themed";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
    // Function to convert date to string
    const dateToString = (tempDate: Date): string => {
        let fDate =
            tempDate.getMonth() + 1 + "/" + tempDate.getDate() + "/" + tempDate.getFullYear();
        let minutes : string | number = tempDate.getMinutes();
        minutes = minutes < 10? '0' + minutes : minutes;
        let hours : string | number = tempDate.getHours();
        hours = hours > 12? hours - 12 : hours;
        
        let fTime = `${hours}:${minutes}`;
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
        padding: 8,
        margin: 16,
        alignItems: "flex-start",
    },
    input: {
        height: 40,
        margin: 16,
        borderWidth: 1,
        padding: 8,
        flex: 8
    },
});
