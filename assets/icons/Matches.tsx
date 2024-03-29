import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, SvgProps } from "react-native-svg";

function SvgComponent(props: SvgProps) {
    return (
        <Svg width={30} height={30} viewBox="0 0 30 30" fill="none" {...props}>
            <G
                clipPath="url(#clip0_185_425)"
                fillRule="evenodd"
                clipRule="evenodd"
                fill={props.color}>
                <Path d="M14.878 0h.244c3.039 0 5.489 0 7.415.259 2 .269 3.685.844 5.022 2.182 1.338 1.337 1.913 3.022 2.182 5.022.26 1.926.26 4.376.259 7.415v.244c0 3.039 0 5.489-.259 7.415-.269 2-.844 3.685-2.182 5.022-1.337 1.338-3.022 1.913-5.022 2.182-1.926.26-4.376.259-7.415.259H4.91c-.707 0-1.394 0-1.96-.076-.64-.086-1.368-.295-1.974-.9-.605-.606-.814-1.335-.9-1.973C0 26.484 0 25.798 0 25.09V14.878C0 11.84 0 9.39.259 7.463c.269-2 .844-3.685 2.182-5.022C3.778 1.103 5.463.528 7.463.259 9.389-.001 11.839 0 14.878 0zM4.798 4.798c.615-.615 1.478-1.016 3.109-1.235 1.679-.226 3.903-.23 7.093-.23s5.415.004 7.093.23c1.63.219 2.494.62 3.11 1.235.614.615 1.015 1.478 1.235 3.109.225 1.678.229 3.903.229 7.093s-.004 5.415-.23 7.093c-.219 1.63-.62 2.494-1.235 3.11-.615.614-1.478 1.015-3.109 1.234-1.678.226-3.903.23-7.093.23H5c-.833 0-1.29-.004-1.607-.047a.409.409 0 01-.012-.001l-.001-.012c-.043-.317-.047-.774-.047-1.607V15c0-3.19.004-5.415.23-7.093.219-1.63.62-2.494 1.235-3.11z" />
                <Path d="M8.334 11.667C8.334 10.747 9.08 10 10 10h10a1.667 1.667 0 010 3.333H10c-.92 0-1.666-.746-1.666-1.666zM8.334 18.333c0-.92.746-1.666 1.666-1.666h5A1.667 1.667 0 0115 20h-5c-.92 0-1.666-.746-1.666-1.667z" />
            </G>
            <Defs>
                <ClipPath id="clip0_185_425">
                    <Path fill="#fff" d="M0 0H30V30H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}

export default SvgComponent;
