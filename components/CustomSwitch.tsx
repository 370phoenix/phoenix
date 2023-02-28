import React from "react";
import { View, Switch } from "react-native";

import Colors from "../constants/Colors";

const CustomSwitch = ({
    isEnabled,
    toggleSwitch,
}: {
    isEnabled: boolean;
    toggleSwitch: any;
}) => {
    return (
        <View>
            <Switch
                trackColor={{ false: Colors.navy.p, true: Colors.navy.p }}
                thumbColor={Colors.gray[5]}
                ios_backgroundColor={Colors.gray[5]}
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View>
    );
};

export default CustomSwitch;
