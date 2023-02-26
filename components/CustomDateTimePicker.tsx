import React from "react";
import { Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { View, Button } from "./Themed";
import { convertDate, convertTime } from "../firebase/ConvertPostTypes";

const CustomDateTimePicker = ({
    date,
    setDate,
    visible,
    setVisible,
    mode,
}: {
    date: Date;
    setDate: any;
    visible: boolean;
    setVisible: any;
    mode: "date" | "time" | "datetime";
}) => {
    if (mode === "datetime") {
        return (
            <View style={{ flexDirection: "row" }}>
                <Button color="green" title={convertDate(date)} onPress={setVisible} />
                <Button color="green" title={convertTime(date)} onPress={setVisible} />
                <DateTimePickerModal
                    isVisible={visible}
                    mode={mode}
                    date={date}
                    onConfirm={setDate}
                    onCancel={setVisible}
                    minuteInterval={5}
                />
            </View>
        );
    } else if (mode === "date") {
        return (
            <View style={{ flexDirection: "row" }}>
                <Button color="green" title={convertDate(date)} onPress={setVisible} />
                <DateTimePickerModal
                    isVisible={visible}
                    mode={mode}
                    date={date}
                    onConfirm={setDate}
                    onCancel={setVisible}
                    minuteInterval={5}
                />
            </View>
        );
    } else
        return (
            <>
                <Button color="green" title={convertTime(date)} onPress={setVisible} />
                <DateTimePickerModal
                    isVisible={visible}
                    date={date}
                    mode={mode}
                    onConfirm={setDate}
                    onCancel={setVisible}
                    minuteInterval={5}
                />
            </>
        );
};

export default CustomDateTimePicker;
