import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function SvgComponent(props: SvgProps) {
    return (
        <Svg width={50} height={39} viewBox="0 0 50 39" fill="none" {...props}>
            <Path
                d="M26 10.912V8.008c1.1-.398 2.225-.697 3.376-.896 1.15-.2 2.357-.3 3.624-.3.867 0 1.717.057 2.55.171.833.114 1.65.257 2.45.427v2.734c-.8-.256-1.608-.448-2.424-.576A16.554 16.554 0 0033 9.375a16.08 16.08 0 00-3.65.407c-1.167.27-2.283.646-3.35 1.13zm0 9.396v-2.904c1.1-.398 2.225-.697 3.376-.897 1.15-.199 2.357-.299 3.624-.299.867 0 1.717.057 2.55.171.833.114 1.65.256 2.45.427v2.734c-.8-.257-1.608-.448-2.424-.576A16.553 16.553 0 0033 18.77c-1.267 0-2.483.128-3.65.384-1.167.256-2.283.64-3.35 1.153zm0-4.697v-2.905c1.1-.398 2.225-.697 3.376-.897 1.15-.199 2.357-.298 3.624-.298.867 0 1.717.056 2.55.17.833.114 1.65.257 2.45.427v2.734c-.8-.257-1.608-.448-2.424-.576A16.553 16.553 0 0033 14.073c-1.267 0-2.483.136-3.65.406-1.167.27-2.283.647-3.35 1.132zm-15 5.722c1.567 0 3.092.15 4.576.448 1.483.3 2.957.748 4.424 1.346V6.3a18.858 18.858 0 00-4.35-1.537 21.47 21.47 0 00-8.224-.214c-1.184.2-2.326.498-3.426.897v16.912a25.895 25.895 0 013.476-.768c1.15-.171 2.324-.257 3.524-.257zm13 1.794a24.606 24.606 0 014.426-1.346A23.127 23.127 0 0133 21.333c1.2 0 2.375.086 3.526.257 1.15.17 2.307.427 3.474.768V5.446a19.576 19.576 0 00-3.424-.897A21.505 21.505 0 0033 4.25c-1.567 0-3.117.17-4.65.513A18.858 18.858 0 0024 6.3v16.827zm-2 5.04a20.271 20.271 0 00-5.2-2.52 18.898 18.898 0 00-5.8-.897c-1.767 0-3.617.285-5.55.854A18.518 18.518 0 000 28.252V3.482c1.467-.855 3.192-1.51 5.176-1.965A25.96 25.96 0 0111 .833c1.933 0 3.825.214 5.676.641A23.691 23.691 0 0122 3.396a23.682 23.682 0 015.326-1.922c1.85-.427 3.74-.64 5.674-.64 1.9 0 3.842.227 5.826.683 1.983.455 3.707 1.11 5.174 1.964v24.771a17.81 17.81 0 00-5.424-2.648c-1.95-.57-3.81-.854-5.576-.854-2 0-3.933.299-5.8.897a20.271 20.271 0 00-5.2 2.52z"
                fill="#fff"
            />
        </Svg>
    );
}

export default SvgComponent;