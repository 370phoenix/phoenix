/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
    Text as DefaultText,
    View as DefaultView,
    Platform,
    TouchableNativeFeedback,
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageSourcePropType,
} from "react-native";

import Colors, { BaseColorIndicators, GrayColorIndicators } from "../constants/Colors";
import Type from "../constants/Type";

type ButtonOnly = {
    title: string;
    light?: boolean;
    clear?: boolean;
    icon?: ImageSourcePropType;
    color: "purple" | "navy" | "gold";
    onPress: (event?: any) => any;
};

type TextOnly = {
    textStyle?: "header" | "display" | "title" | "lineTitle" | "label" | "body";
    styleSize?: "l" | "m" | "s";
};

export type TextProps = DefaultText["props"] & TextOnly;
export type ViewProps = DefaultView["props"];
export type ButtonProps = DefaultView["props"] & ButtonOnly;

// Still worth keeping custom text, but with our own props
export function Text(props: TextProps) {
    const { style, textStyle, styleSize, ...otherProps } = props;
    let textStyleSheet: any = {};

    if (textStyle) {
        textStyleSheet = Type[textStyle];
        if (styleSize) {
            textStyleSheet = textStyleSheet[styleSize];
        }
    }

    return <DefaultText style={[textStyleSheet, style]} {...otherProps} />;
}

// Same here
export function View(props: ViewProps) {
    const { style, ...otherProps } = props;

    return <DefaultView style={style} {...otherProps} />;
}

// title: text displayed in button
// light: No background, color text if true. reverse if false.
// color: background or text color depending on light
export function Button(props: ButtonProps) {
    const { style, color, clear, light, icon, ..._ } = props;
    const Touchable: any = Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;
    const buttonStyles: Array<any> = [buttonComponentStyles.button];
    const textStyles: Array<any> = [buttonComponentStyles.text];
    const baseColor = Colors[color];

    if (!clear) {
        if (light) {
            buttonStyles.push({ backgroundColor: baseColor["4"] });
            textStyles.push({ color: baseColor["p"], marginHorizontal: 16 });
        } else {
            buttonStyles.push({ backgroundColor: baseColor["p"] });
            textStyles.push({ color: Colors.gray.w, marginHorzontal: 16 });
        }
    } else {
        buttonStyles.push({ flexDirection: "row" });
        if (light) {
            textStyles.push({ color: baseColor["4"] });
        } else {
            textStyles.push({ color: baseColor["p"] });
        }
    }

    if (Platform.OS == "android") buttonStyles.push(style);

    if (icon)
        return (
            <Touchable onPress={props.onPress} style={Platform.OS == "ios" ? style : null}>
                <View style={buttonStyles}>
                    <Image style={buttonComponentStyles.icon} source={icon} />
                    <Text textStyle="label" styleSize="l" style={textStyles}>
                        {props.title}
                    </Text>
                </View>
            </Touchable>
        );

    return (
        <Touchable onPress={props.onPress} style={Platform.OS == "ios" ? style : null}>
            <View style={buttonStyles}>
                <Text textStyle="label" styleSize="l" style={textStyles}>
                    {props.title}
                </Text>
            </View>
        </Touchable>
    );
}

const buttonComponentStyles = StyleSheet.create({
    button: { borderRadius: 4, alignItems: "center" },
    text: { textAlign: "center", marginVertical: 8 },
    icon: {},
});
