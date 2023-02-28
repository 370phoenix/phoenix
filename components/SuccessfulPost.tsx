import { useEffect } from "react";
import {
    View,
    Animated,
    Easing,
} from "react-native";

import { Spacer, Text } from "./Themed";
import { Car } from "../assets/icons/Car";
import { Dust } from "../assets/icons/Dust";
import Colors from "../constants/Colors";

const SuccessfulPost = () => {
    const animatedValue = new Animated.Value(0);
    const easing = Easing.elastic(1);
    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 1,
            easing,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <>
            <View
                style={{
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "90%",
                    paddingHorizontal: 40,
                }}>
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateX: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-600, 0],
                                }),
                            },
                        ],
                    }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Dust color={Colors.purple.p} />
                        <Spacer direction="row" size={8} />
                        <Car color={Colors.purple.p} />
                    </View>
                </Animated.View>
                <Spacer direction="column" size={64} />
                <Text textStyle="header" styleSize="m" style={{ color: Colors.purple.p }}>
                    SUCCESSFULLY POSTED!
                </Text>
            </View>
            <View style={{ backgroundColor: Colors.gray[4], height: "10%" }} />
        </>
    );
};

export default SuccessfulPost;