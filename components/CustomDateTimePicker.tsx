import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { View, Button } from "./Themed";
import { convertDate, convertTime } from "../firebase/ConvertPostTypes";

const CustomDateTimePicker = ({ date, setDate, mode }: { date: Date, setDate: any, mode: "date" | "time" }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    if (mode === "date") {
        return (
            <View>
                <Button color="green" title={convertDate(date)} onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode={mode}
                    date={date}
                    onConfirm={hideDatePicker}
                    onChange={setDate}
                    onCancel={hideDatePicker}
                    minimumDate={new Date()}
                />
            </View>
        );
    }
    else return (
        <>
            <Button color="green" title={convertTime(date)} onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    date={date}
                    mode={mode}
                    onConfirm={hideDatePicker}
                    onChange={setDate}
                    onCancel={hideDatePicker}
                    minuteInterval={5}
                />
        </>
    )
};

export default CustomDateTimePicker;