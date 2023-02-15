import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const Down = (props: SvgProps) => (
    <Svg width={32} height={30} fill="none" {...props} viewBox="0 0 32 30">
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m31.101 10.101-3.535-3.535L16 18.13 4.434 6.566.9 10.1 16 25.202l15.101-15.1Z"
            fill={props.color}
        />
    </Svg>
);

const Up = (props: SvgProps) => (
    <Svg width={32} height={30} fill="none" {...props} viewBox="0 0 32 30">
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M31.101 21.566 27.566 25.1 16 13.536 4.434 25.1.9 21.566 16 6.464l15.101 15.102Z"
            fill={props.color}
        />
    </Svg>
);

const Left = (props: SvgProps) => (
    <Svg width={30} height={32} fill="none" {...props} viewBox="0 0 32 30">
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.566.899 25.1 4.434 13.536 16 25.1 27.566 21.566 31.1 6.464 16 21.566.899Z"
            fill={props.color}
        />
    </Svg>
);

const Right = (props: SvgProps) => (
    <Svg width={30} height={32} fill="none" {...props} viewBox="0 0 32 30">
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.101.899 6.566 4.434 18.13 16 6.566 27.566 10.1 31.1 25.202 16 10.102.899Z"
            fill={props.color}
        />
    </Svg>
);

export { Down, Up, Left, Right };
