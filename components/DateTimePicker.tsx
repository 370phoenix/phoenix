import { SafeAreaView, StyleSheet, Text, View, Platform } from "react-native";
import React, { useState } from "react";
import { Button } from "./Themed";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
    // Function to convert date to string (Not used in this file, will be useful for reading from database)
    // const dateToString = (tempDate: Date): string => {
    //     let fDate =
    //         tempDate.getMonth() + 1 + "/" + tempDate.getDate() + "/" + tempDate.getFullYear();
    //     let minutes: string | number = tempDate.getMinutes();
    //     minutes = minutes < 10 ? "0" + minutes : minutes;
    //     let hours: string | number = tempDate.getHours();
    //     hours = hours > 12 ? hours - 12 : hours;

    //     let fTime = `${hours}:${minutes}`;
    //     return fDate + " " + fTime;
    // };

    const [date, setDate] = useState(new Date());
    // const [text, setText] = useState(dateToString(new Date()));

    const onChange = (event: any, selectedDate?: Date | undefined) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        // setText(dateToString(tempDate));
    };

    return (
        <View>
            <Text style={styles.label}>When do you want a ride?</Text>
            <View style={styles.container}>
                <DateTimePicker
                    style={styles.dateTime}
                    testID="dateTimePicker"
                    value={date}
                    mode={"date"}
                    is24Hour={false}
                    display={"default"}
                    onChange={onChange}
                    minimumDate={new Date()}
                />
                <DateTimePicker
                    style={styles.dateTime}
                    testID="dateTimePicker"
                    value={date}
                    mode={"time"}
                    is24Hour={false}
                    display={"default"}
                    onChange={onChange}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 16,
        justifyContent:"flex-start",
        display: "flex",
        flexDirection: "row",
    },
    dateTime: {
        marginRight: 16,
    },
    label: {
        marginBottom: 8,
        marginLeft: 16,
    },
});
