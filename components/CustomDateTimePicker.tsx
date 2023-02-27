import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { View, Button } from "./Themed";
import { convertDate, convertTime } from "../firebase/ConvertPostTypes";

export const CustomDateTimePicker = ({
    mode,
    date,
    onConfirm,
}: {
    mode: "date" | "time" | "datetime";
    date: Date;
    onConfirm: any;
}) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        onConfirm(date);
        hideDatePicker();
    };

    let title: string = convertDate(date);
    if (mode === "time") title = convertTime(date);
    else if (mode === "datetime") title = convertDate(date) + " " + convertTime(date);
    return (
        <View>
            <Button color="green" title={title} onPress={showDatePicker} />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={mode}
                date={date}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
                minuteInterval={5}
            />
        </View>
    );
};
