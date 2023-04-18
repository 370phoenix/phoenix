import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, SvgProps } from "react-native-svg";

export default function Alert(props: SvgProps) {
    return (
        <Svg
            width={props.width || 32}
            height={props.height || 30}
            viewBox="0 0 32 30"
            fill="none"
            {...props}>
            <G
                clipPath="url(#clip0_332_418)"
                stroke={props.color}
                strokeWidth={3}
                strokeLinecap="round">
                <Path d="M16 11.667v5M16 21.667v-.019" />
                <Path
                    d="M13.086 3.578L2.085 23.381c-1.235 2.222.372 4.952 2.914 4.952h22.003c2.541 0 4.148-2.73 2.914-4.952L18.914 3.578c-1.27-2.286-4.558-2.286-5.828 0z"
                    strokeLinejoin="round"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_332_418">
                    <Path d="M0 0H32V30H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}
