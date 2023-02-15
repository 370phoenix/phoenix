import * as React from "react";
import Svg, { SvgProps, Circle, Path } from "react-native-svg";

const CreateButton = (props: SvgProps) => (
    <Svg width={80} height={80} fill="none" {...props} viewBox="0 0 80 80">
        <Circle cx={40} cy={40} r={40} fill="#EEECF0" />
        <Circle cx={40} cy={40} r={32} fill={props.color} stroke="#402E5A" strokeWidth={6} />
        <Path
            d="M20.113 40h39.773M40 20.114v39.773"
            stroke="#402E5A"
            strokeWidth={6.364}
            strokeLinecap="round"
        />
    </Svg>
);

export default CreateButton;
