import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function SvgComponent(props: SvgProps) {
    return (
        <Svg width={35} height={35} viewBox="0 0 35 35" fill="none" {...props}>
            <Path
                d="M31.5 0h-28C1.575 0 .018 1.575.018 3.5L0 35l7-7h24.5a3.51 3.51 0 003.5-3.5v-21A3.51 3.51 0 0031.5 0zm0 24.5H5.547l-1.032 1.032L3.5 26.547V3.5h28v21zm-15.75-7h3.5V21h-3.5v-3.5zm0-10.5h3.5v7h-3.5V7z"
                fill="#402E5A"
            />
        </Svg>
    );
}

export default SvgComponent;
