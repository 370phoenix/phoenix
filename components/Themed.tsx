/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
    Text as DefaultText,
    View as DefaultView,
    Pressable,
    Platform,
    TouchableNativeFeedback,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const theme = useColorScheme();
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

type ButtonOnly = {
    title: string;
    light?: boolean;
    color: string;
    onPress: (event?: any) => any;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ButtonProps = ThemeProps & DefaultView["props"] & ButtonOnly;

export function Text(props: TextProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Button(props: ButtonProps) {
    const { style, ..._ } = props;
    const Touchable: any = Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;
    const buttonStyles: Array<any> = [buttonComponentStyles.button];
    const textStyles: Array<any> = [buttonComponentStyles.text];

    if (props.light) {
        textStyles.push({ color: props.color });
    } else {
        buttonStyles.push({ backgroundColor: props.color });
        textStyles.push({ color: "white" });
    }

    if (Platform.OS == "android") buttonStyles.push(style);

    return (
        <Touchable onPress={props.onPress} style={Platform.OS == "ios" ? style : null}>
            <View style={buttonStyles}>
                <Text style={textStyles}>{props.title}</Text>
            </View>
        </Touchable>
    );
}

const buttonComponentStyles = StyleSheet.create({
    button: { elevation: 4, borderRadius: 3 },
    text: { textAlign: "center", margin: 8, fontSize: 26 },
});
