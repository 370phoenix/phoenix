import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, SvgProps } from "react-native-svg";

function SvgComponent(props: SvgProps) {
    return (
        <Svg width={28} height={30} viewBox="0 0 28 30" fill="none" {...props}>
            <G clipPath="url(#clip0_190_453)">
                <Path
                    d="M18.555 1.16v3.886H1.866c-.654 0-1.227.573-1.227 1.268v10.799l4.377-3.887c.204-.246.41-.327.614-.45v-2.74h12.925v3.886c0 1.145.695 1.472 1.636.654l6.585-6.054c.287-.246.491-.573.491-.981 0-.368-.204-.737-.49-.982L20.19.505c-.941-.818-1.636-.49-1.636.655zm8.059 11.78l-4.337 3.926c-.204.164-.49.287-.654.41v2.741H8.738V16.09c0-1.145-.695-1.432-1.636-.614L.475 21.53c-.287.246-.45.573-.45.982 0 .368.163.737.45.982l6.627 6.012c.941.819 1.636.532 1.636-.613v-3.887h16.648c.695 0 1.228-.573 1.228-1.268V12.94z"
                    fill={props.color}
                />
            </G>
        </Svg>
    );
}

export default SvgComponent;
