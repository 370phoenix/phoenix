import { Text, TextProps } from "./Themed";

export function ErrorText(props: TextProps) {
    return <Text {...props} style={[props.style, { color: "#FF0000", fontFamily: "space-mono" }]} />;
}