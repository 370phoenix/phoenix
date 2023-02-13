import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App({ onChange, date }: { onChange: any; date: Date }) {
    return (
        <View>
            <Text style={styles.label}>When do you want a ride?</Text>
            <View style={styles.container}>
                <DateTimePicker
                    style={styles.dateTime}
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={false}
                    display="default"
                    onChange={onChange}
                    minimumDate={new Date()}
                />
                <DateTimePicker
                    style={styles.dateTime}
                    testID="dateTimePicker"
                    value={date}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    minuteInterval={5}
                    onChange={onChange}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 16,
        justifyContent: "flex-start",
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
