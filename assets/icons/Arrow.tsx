import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export function Left(props: SvgProps) {
    return (
        <Svg width={30} height={30} viewBox="0 0 30 30" fill="none" {...props}>
            <Path
                d="M11.537 26.537h6.926L9.229 17.31H30V12.69H9.229l9.234-9.228h-6.926L0 15l11.537 11.537z"
                fill={props.color}
            />
        </Svg>
    );
}

export function Right(props: SvgProps) {
    return (
        <Svg width={30} height={30} viewBox="0 0 30 30" fill="none" {...props}>
            <Path
                d="M18.463 3.463h-6.926l9.234 9.228H0v4.618h20.771l-9.234 9.228h6.926L30 15 18.463 3.463z"
                fill={props.color}
            />
        </Svg>
    );
}

export function Down(props: SvgProps) {
    return (
        <Svg width={30} height={30} viewBox="0 0 30 30" fill="none" {...props}>
            <Path
                d="M26.537 18.463v-6.926l-9.228 9.234V0H12.69v20.771l-9.228-9.234v6.926L15 30l11.537-11.537z"
                fill={props.color}
            />
        </Svg>
    );
}

export function Up(props: SvgProps) {
    return (
        <Svg width={30} height={30} viewBox="0 0 30 30" fill="none" {...props}>
            <Path
                d="M3.463 11.537v6.926l9.228-9.234V30h4.618V9.229l9.228 9.234v-6.926L15 0 3.463 11.537z"
                fill={props.color}
            />
        </Svg>
    );
}
