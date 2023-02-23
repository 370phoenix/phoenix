import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function SvgComponent(props: SvgProps) {
    return (
        <Svg width={22} height={24} viewBox="0 0 22 24" fill="none" {...props}>
            <Path
                d="M6.667 0v1.333H0V4h1.333v17.333A2.667 2.667 0 004 24h13.333A2.667 2.667 0 0020 21.333V4h1.333V1.333h-6.666V0h-8zM4 4h13.333v17.333H4V4zm2.667 2.667v12h2.666v-12H6.667zm5.333 0v12h2.667v-12H12z"
                fill={props.color}
            />
        </Svg>
    );
}

export default SvgComponent;
