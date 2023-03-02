import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function SvgComponent(props: SvgProps) {
    return (
        <Svg width="800px" height="800px" viewBox="-5 0 32 32" {...props}>
            <Path
                d="M21.08 12.84L12.16 9.6c-.4-.16-.88-.2-1.16-.2-.32 0-.76.04-1.16.2L.92 12.84c-.84.32-.92.88-.92 1.12s.08.8.92 1.12l.4.12v3.32c0 .48.36.84.84.84S3 19 3 18.52V15.8l1.56.56v3.76c0 1.64 3.84 2.44 6.44 2.44s6.44-.76 6.44-2.44V16.4l3.64-1.32c.84-.28.92-.88.92-1.12s-.08-.8-.92-1.12zm-5.28 7.08c-.48.32-2.28.96-4.76.96s-4.32-.64-4.76-.96V17l3.6 1.32c.4.16.88.2 1.16.2s.76-.04 1.16-.2L15.8 17v2.92zm-4.2-3.2c-.28.12-.88.12-1.16 0L2.8 13.96l7.6-2.76c.28-.12.88-.12 1.16 0l7.64 2.76-7.6 2.76z"
                fill={props.color}
            />
        </Svg>
    );
}

export default SvgComponent;
