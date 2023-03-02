import { useState } from "react";
import {
    Text as DefaultText,
    View as DefaultView,
    TextInput,
    StyleSheet,
    Pressable,
    Platform,
    Switch,
    GestureResponderEvent,
    PressableProps,
} from "react-native";

import Colors, { BaseColor, BaseColorIndicators } from "../../constants/Colors";
import { SvgProps } from "react-native-svg";
import Type, { TypeFamily, TypeShape } from "../../constants/Type";

type SpacerOnly = {
    direction: "column" | "row";
    size: number;
};
export type SpacerProps = DefaultView["props"] & SpacerOnly;

export function Spacer({ style, direction, size, ...otherProps }: SpacerProps) {
    const defaultValue = "auto";
    const horizontal = direction === "row";
    return (
        <View
            style={{
                width: horizontal ? size : defaultValue,
                height: !horizontal ? size : defaultValue,
            }}
            {...otherProps}
        />
    );
}

type TextOnly = {
    textStyle?: "header" | "display" | "title" | "lineTitle" | "label" | "body";
    styleSize?: "l" | "m" | "s";
};

export type TextProps = DefaultText["props"] & TextOnly;
// Still worth keeping custom text, but with our own props
export function Text({ style, textStyle, styleSize, ...otherProps }: TextProps) {
    let textStyleSheet: any = {};

    if (textStyle) {
        textStyleSheet = Type[textStyle];
        if (styleSize) {
            textStyleSheet = textStyleSheet[styleSize];
        } else {
            textStyleSheet = textStyleSheet["l"];
        }
    }

    return <DefaultText style={[textStyleSheet, style]} {...otherProps} />;
}

export type ViewProps = DefaultView["props"];

// Same here
export function View({ style, ...otherProps }: ViewProps) {
    return <DefaultView style={style} {...otherProps} />;
}

type ButtonOnly = {
    title: string;
    light?: boolean;
    clear?: boolean;
    short?: boolean;
    fontSize?: number;
    leftIcon?: (props: SvgProps) => React.ReactElement;
    rightIcon?: (props: SvgProps) => React.ReactElement;
    color: "purple" | "navy" | "gold" | "gray" | "red" | "green";
    onPress: (event?: GestureResponderEvent) => void;
};
export type ButtonProps = PressableProps & ButtonOnly;

// title: text displayed in button
// light: No background, color text if true. reverse if false.
// color: background or text color depending on light
export function Button({
    style,
    color,
    clear,
    short = false,
    light,
    leftIcon,
    rightIcon,
    fontSize,
    title,
    onPress,
    ...otherProps
}: ButtonProps) {
    const [tempStyles, setTempStyles] = useState({});
    const containerStyles: any = {};
    const textStyles: any = {};
    let baseColor = Colors["purple"];
    const gray = color === "gray";
    if (!gray) baseColor = Colors[color];

    let text = title;

    const textColor = clear
        ? light
            ? gray
                ? Colors.gray.w
                : baseColor["4"]
            : gray
            ? Colors.gray.b
            : baseColor["p"]
        : light
        ? gray
            ? Colors.gray.b
            : baseColor["p"]
        : Colors.gray.w;
    const bgColor = clear
        ? "transparent"
        : light
        ? gray
            ? Colors.gray["5"]
            : baseColor["4"]
        : gray
        ? Colors.gray["1"]
        : baseColor["p"];
    const highlight = clear
        ? Colors.gray["5"]
        : light
        ? gray
            ? Colors.gray["4"]
            : baseColor["3"]
        : gray
        ? Colors.gray["2"]
        : baseColor["m"];

    textStyles.color = textColor;
    textStyles.fontSize = fontSize ? fontSize : undefined;
    containerStyles.backgroundColor = bgColor;
    containerStyles.gap = 8;

    if (!short) containerStyles.paddingVertical = 8;

    if (clear) {
        containerStyles.flexDirection = "row";
        containerStyles.paddingHorizontal = 8;
        text = text.toUpperCase();
    } else {
        containerStyles.paddingHorizontal = 12;
    }

    const onPressIn = () => {
        setTempStyles({
            backgroundColor: clear ? bgColor : highlight,
            opacity: clear ? 0.8 : 1,
        });
    };

    const onPressOut = () => {
        setTempStyles({
            backgroundColor: bgColor,
            opacity: 1,
        });
    };

    const iconSize = short && text !== "" ? 10 : 20;
    const spacerSize = short && text !== "" ? 0 : 8;

    return (
        <Pressable
            onPress={onPress}
            style={style}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            {...otherProps}>
            <View style={[buttonStyles.button, containerStyles, tempStyles]}>
                {leftIcon && (
                    <>
                        {leftIcon({
                            color: textColor,
                            preserveAspectRatio: "xMidYMid meet",
                            height: iconSize,
                            width: iconSize,
                        })}
                        <Spacer direction="row" size={spacerSize} />
                    </>
                )}
                <Text
                    textStyle={clear ? "lineTitle" : "label"}
                    styleSize={clear ? undefined : "l"}
                    style={[buttonStyles.text, textStyles, tempStyles]}>
                    {text}
                </Text>
                {rightIcon && (
                    <>
                        <Spacer direction="row" size={spacerSize} />
                        {rightIcon({
                            color: textColor,
                            preserveAspectRatio: "xMidYMid meet",
                            height: iconSize,
                            width: iconSize,
                        })}
                    </>
                )}
            </View>
        </Pressable>
    );
}

const buttonStyles = StyleSheet.create({
    button: {
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    text: { textAlign: "center" },
});

export enum ValidationState {
    error,
    valid,
    default,
    disabled,
}

type TextFieldOnly = {
    textStyle?: [keyof TypeShape, keyof TypeFamily];
    label: string;
    light?: boolean;
    inputState: [string, React.Dispatch<React.SetStateAction<string>>];
    validationState?: ValidationState;
};
export type TextFieldProps = TextInput["props"] & TextFieldOnly;

export function TextField({
    textStyle = ["body", "m"],
    light = false,
    label,
    style,
    inputState,
    validationState = ValidationState.default,
    ...otherProps
}: TextFieldProps) {
    const [family, size] = textStyle;
    const fontStyles = Type[family][size];
    const [text, setText] = inputState;

    const { container: containerStyle, input: inputStyle, label: labelStyle } = textFieldStyles;
    let color;

    if (validationState == ValidationState.error)
        color = !light ? Colors.red["m"] : Colors.red["2"];
    else if (validationState == ValidationState.valid)
        color = !light ? Colors.green["m"] : Colors.green["2"];
    else if (validationState == ValidationState.disabled)
        color = !light ? Colors.gray["3"] : Colors.gray["2"];
    else color = !light ? Colors.gray["1"] : Colors.gray["5"];

    return (
        <View style={[style, containerStyle]}>
            <TextInput
                value={text}
                onChangeText={setText}
                allowFontScaling={false}
                style={[fontStyles, inputStyle, { borderColor: color, color: color }]}
                {...otherProps}
            />
            <Spacer direction="column" size={4} />
            <Text
                textStyle="label"
                styleSize="s"
                style={[labelStyle, { color: color }]}
                allowFontScaling={false}>
                {label}
            </Text>
        </View>
    );
}

const textFieldStyles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    label: {
        color: "undefined",
    },
    input: {
        borderBottomWidth: 2,
        paddingVertical: 5,
    },
});

type TextAreaOnly = {
    textStyle?: [keyof TypeShape, keyof TypeFamily];
    label: string;
    light?: boolean;
    inputState: [string, React.Dispatch<React.SetStateAction<string>>];
    validationState?: ValidationState;
};
export type TextAreaProps = TextInput["props"] & TextAreaOnly;

export function TextArea({
    textStyle = ["body", "m"],
    light = false,
    label,
    style,
    inputState,
    numberOfLines = 4,
    validationState = ValidationState.default,
    ...otherProps
}: TextAreaProps) {
    const [family, size] = textStyle;
    const fontStyles = Type[family][size];
    const [text, setText] = inputState;

    const { container: contianerStyle, input: inputStyle, label: labelStyle } = textAreaStyles;
    let color;

    if (validationState == ValidationState.error)
        color = !light ? Colors.red["m"] : Colors.red["2"];
    else if (validationState == ValidationState.valid)
        color = !light ? Colors.green["m"] : Colors.green["2"];
    else if (validationState == ValidationState.disabled)
        color = !light ? Colors.gray["3"] : Colors.gray["2"];
    else color = !light ? Colors.gray["1"] : Colors.gray["5"];

    return (
        <View style={[style, contianerStyle]}>
            <TextInput
                value={text}
                onChangeText={setText}
                allowFontScaling={false}
                // multiline
                // numberOfLines={numberOfLines}
                style={[fontStyles, inputStyle, { borderColor: color, color: color }]}
                {...otherProps}
            />
            <Spacer direction="column" size={4} />
            <Text
                textStyle="label"
                styleSize="s"
                style={[labelStyle, { color: color }]}
                allowFontScaling={false}>
                {label}
            </Text>
        </View>
    );
}

const textAreaStyles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    label: {
        color: "undefined",
    },
    input: {
        borderWidth: 2,
        borderRadius: 8,
        textAlignVertical: "top",
        padding: 8,
    },
});

type LabeledSwitchOnly = {
    label: string;
    color?: "purple" | "gold" | "navy";
};
export type LabeledSwitchProps = Switch["props"] & LabeledSwitchOnly;

export function LabeledSwitch({
    style,
    label,
    color = "purple",
    ...otherProps
}: LabeledSwitchProps) {
    const baseColor: BaseColor<BaseColorIndicators> = Colors[color];
    return (
        <View style={[style, labeledSwitchStyles.container]}>
            <Switch
                style={labeledSwitchStyles.switch}
                trackColor={{ true: baseColor["p"], false: baseColor["m"] }}
                thumbColor={Colors.gray.w}
                {...otherProps}
            />
            <Text textStyle="label" styleSize="s" style={labeledSwitchStyles.label}>
                {label}
            </Text>
        </View>
    );
}

const labeledSwitchStyles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
    label: { fontSize: 11 },
    switch: { marginBottom: Platform.OS === "ios" ? 4 : 0 },
});
