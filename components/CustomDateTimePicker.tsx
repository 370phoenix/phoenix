import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "./Themed";

export default function CustomDateTimePicker({
    onChangeStart,
    start,
    onChangeEnd,
    end,
}: {
    onChangeStart: any;
    start: Date;
    onChangeEnd: any;
    end: Date;
}) {
    return (
        <View>
            <View style={styles.container}>
                <DateTimePicker
                    testID="dateTimePicker"
                    value={start}
                    mode="date"
                    is24Hour={false}
                    display="default"
                    onChange={onChangeStart}
                    minimumDate={new Date()}
                />
                <DateTimePicker
                    testID="dateTimePicker"
                    value={start}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    minuteInterval={5}
                    onChange={onChangeStart}
                />
                <Text> to </Text>
                <DateTimePicker
                    testID="dateTimePicker"
                    value={end}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    minuteInterval={5}
                    onChange={onChangeEnd}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});
