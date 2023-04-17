import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { View, Text } from "./Themed";
import { convertDate, convertTime } from "../../utils/convertPostTypes";
import { Pressable, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const CustomDateTimePicker = ({
    mode,
    date,
    onConfirm,
}: {
    mode: "date" | "time";
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

    const title = mode === "date" ? convertDate(date) : convertTime(date);
    return (
        <View>
            <Pressable style={styles.dateTimeButton} onPress={showDatePicker}>
                <Text textStyle="body" styleSize="m" style={styles.dateTimeText}>
                    {title}
                </Text>
            </Pressable>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={mode}
                date={date}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minuteInterval={5}
            />
        </View>
    );
};

export default CustomDateTimePicker;

const styles = StyleSheet.create({
    dateTimeButton: {
        backgroundColor: Colors.gray[3],
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    dateTimeText: {
        color: Colors.gray.b,
    },
});
