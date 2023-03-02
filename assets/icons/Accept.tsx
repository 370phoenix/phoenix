import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function SvgComponent(props: SvgProps) {
    return (
        <Svg width={28} height={28} viewBox="0 0 28 28" {...props}>
            <Path
                d="M5.833 16.333l3.9 2.925a1 1 0 001.374-.167L21 7"
                stroke={props.color}
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
}

export default SvgComponent;
