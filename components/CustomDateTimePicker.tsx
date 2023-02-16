import DateTimePicker from "@react-native-community/datetimepicker";

import React, { useState } from "react";
import { StyleSheet, Platform, TouchableOpacity } from "react-native";
import ConvertPostTypes from "../firebase/ConvertPostTypes";

import { Text, View } from "./Themed";

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
    const [mode, setMode] = useState("date");
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState("start");
    const onChange = (event: any, selectedValue?: Date) => {
        setShow(false);
    };

    const showMode = (mode: string, select: string) => {
        setSelected(select);
        setShow(true);
        setMode(mode);
    };
    return (
        <View>
            {Platform.OS === "ios" && (
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
            )}
            {Platform.OS !== "ios" && (
                <View>
                    <TouchableOpacity onPress={() => showMode("date", "start")}>
                        <Text>{ConvertPostTypes.convertDate(start)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showMode("time", "start")}>
                        <Text>{ConvertPostTypes.convertTime(start)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showMode("time", "end")}>
                        <Text>{ConvertPostTypes.convertTime(end)}</Text>
                    </TouchableOpacity>
                </View>
            )}
            {Platform.OS !== "ios" && show && (
                <View>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={start}
                        mode={mode === "date" ? "date" : "time"}
                        is24Hour
                        display="default"
                        onChange={(event) => {
                            if (selected === "start") {
                                onChangeStart();
                                onChange(event, start);
                            } else {
                                onChangeEnd();
                                onChange(event, end);
                            }
                        }}
                    />
                </View>
            )}
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
