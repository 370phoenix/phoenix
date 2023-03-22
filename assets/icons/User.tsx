import * as React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

export function Full(props: SvgProps) {
    return (
        <Svg
            width={28}
            height={30}
            viewBox="0 0 28 30"
            fill="none"
            {...props}
            strokeWidth={props.stroke ? 2 : 0}
            stroke={props.stroke}>
            <Circle cx={14} cy={8} r={8} fill={props.color} />
            <Path
                d="M2.062 20.213C3.096 17.535 5.772 16 8.642 16h10.715c2.871 0 5.547 1.535 6.58 4.213.926 2.395 1.869 5.555 2.037 8.787.028.552-.422 1-.974 1H1c-.552 0-1.002-.448-.974-1 .168-3.232 1.111-6.392 2.036-8.787z"
                fill={props.color}
            />
        </Svg>
    );
}

export function Outline(props: SvgProps) {
    return (
        <Svg width={30} height={31} viewBox="0 0 30 31" fill="none" {...props}>
            <Circle
                cx={15}
                cy={8}
                r={7}
                stroke={props.color}
                strokeWidth={2}
                strokeLinecap="round"
            />
            <Path
                d="M3.062 20.213C4.096 17.535 6.772 16 9.642 16h10.715c2.871 0 5.547 1.535 6.58 4.213.926 2.395 1.869 5.555 2.037 8.787.028.552-.422 1-.974 1H2c-.552 0-1.002-.448-.974-1 .168-3.232 1.111-6.392 2.036-8.787z"
                stroke={props.color}
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
}
