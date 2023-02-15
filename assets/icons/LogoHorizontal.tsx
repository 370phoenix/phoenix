import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const LogoHorizontal = (props: SvgProps) => (
    <Svg width={145} height={30} fill="none" viewBox="0 0 145 30" {...props}>
        <Path
            d="M0 26.788V4.948h13.418l-.597 4.117H5.813v5.247h6.159v4.117H5.813v8.359H0ZM29.098 21.634c0 .608.079 1.058.236 1.352.157.293.435.513.832.66l-1.131 3.613c-1.068-.084-1.943-.304-2.624-.66-.68-.356-1.23-.922-1.65-1.697-1.068 1.634-2.754 2.451-5.058 2.451-1.655 0-2.98-.487-3.976-1.461-.995-.974-1.492-2.236-1.492-3.786 0-1.844.68-3.258 2.042-4.243 1.362-.984 3.33-1.476 5.908-1.476h1.445v-.566c0-.901-.188-1.514-.565-1.839-.378-.324-1.058-.487-2.043-.487-.523 0-1.178.079-1.964.236-.785.157-1.586.372-2.403.644l-1.226-3.613a16.356 16.356 0 0 1 3.236-.959c1.153-.22 2.221-.33 3.206-.33 2.514 0 4.347.498 5.499 1.492 1.152.996 1.728 2.52 1.728 4.573v6.096ZM21.4 23.425c.46 0 .884-.12 1.272-.36.388-.242.707-.572.958-.991V19.37h-.942c-1.006 0-1.75.184-2.232.55-.482.367-.722.917-.722 1.65 0 .566.146 1.016.44 1.352.293.335.702.502 1.226.502ZM42.108 9.536c.545 0 1.11.094 1.697.283l-.912 5.404a5.164 5.164 0 0 0-1.508-.251c-.943 0-1.66.32-2.152.959-.493.639-.875 1.608-1.147 2.907v7.95h-5.594v-16.75h4.871l.503 3.175c.335-1.11.895-2.001 1.68-2.672.786-.67 1.64-1.005 2.562-1.005ZM60.396 18.146c0 .125-.031.754-.094 1.885H50.058c.147 1.279.508 2.153 1.084 2.625.576.47 1.398.706 2.467.706.628 0 1.251-.12 1.869-.36.618-.242 1.294-.614 2.028-1.116l2.262 3.08a10.479 10.479 0 0 1-3.017 1.743c-1.131.43-2.356.644-3.676.644-2.85 0-5.012-.8-6.49-2.403-1.476-1.603-2.214-3.756-2.214-6.459 0-1.696.308-3.226.926-4.587.618-1.362 1.535-2.44 2.75-3.236 1.215-.797 2.681-1.195 4.4-1.195 2.45 0 4.388.76 5.813 2.278 1.424 1.52 2.136 3.65 2.136 6.395Zm-5.498-1.571c-.022-1.11-.21-1.97-.567-2.577-.356-.608-.953-.911-1.79-.911-.776 0-1.362.272-1.76.817-.398.544-.65 1.498-.754 2.86h4.87v-.19ZM70.263 4.382c1.656 0 3.117.24 4.384.723a10.056 10.056 0 0 1 3.41 2.168l-2.608 3.08c-1.509-1.194-3.09-1.791-4.745-1.791-.86 0-1.514.162-1.965.487-.45.325-.675.78-.675 1.366 0 .42.115.765.345 1.038.231.272.619.534 1.163.785.545.252 1.404.566 2.577.943 2.241.712 3.88 1.608 4.917 2.686 1.038 1.08 1.557 2.572 1.557 4.478 0 1.383-.357 2.603-1.07 3.661-.712 1.058-1.744 1.88-3.095 2.467-1.35.587-2.938.88-4.76.88-3.478 0-6.317-1.058-8.516-3.174l2.86-3.174c1.739 1.425 3.55 2.137 5.436 2.137.985 0 1.75-.215 2.294-.643.545-.43.817-1.001.817-1.714 0-.503-.105-.916-.314-1.241-.21-.325-.582-.618-1.116-.88-.534-.261-1.315-.55-2.341-.864-2.472-.775-4.211-1.707-5.217-2.796-1.005-1.09-1.508-2.462-1.508-4.117 0-1.299.351-2.44 1.053-3.425.702-.985 1.676-1.744 2.923-2.279 1.246-.534 2.644-.801 4.194-.801ZM91.255 9.473c1.424 0 2.545.445 3.362 1.336.817.89 1.225 2.12 1.225 3.691v12.288H90.25V15.507c0-.734-.11-1.242-.33-1.525-.22-.282-.54-.424-.958-.424-.86 0-1.687.64-2.482 1.917v11.313h-5.594V3.44l5.594-.566v8.799c.69-.754 1.423-1.31 2.198-1.665.776-.357 1.635-.535 2.578-.535ZM112.843 21.634c0 .608.078 1.058.235 1.352.158.293.435.513.833.66l-1.131 3.613c-1.069-.084-1.943-.304-2.624-.66-.681-.356-1.231-.922-1.65-1.697-1.069 1.634-2.755 2.451-5.059 2.451-1.655 0-2.98-.487-3.975-1.461-.995-.974-1.493-2.236-1.493-3.786 0-1.844.681-3.258 2.043-4.243 1.361-.984 3.33-1.476 5.907-1.476h1.446v-.566c0-.901-.189-1.514-.566-1.839-.377-.324-1.058-.487-2.042-.487-.524 0-1.178.079-1.964.236-.786.157-1.587.372-2.404.644l-1.225-3.613a16.363 16.363 0 0 1 3.236-.959c1.152-.22 2.221-.33 3.206-.33 2.513 0 4.346.498 5.498 1.492 1.152.996 1.729 2.52 1.729 4.573v6.096Zm-7.699 1.791c.461 0 .885-.12 1.272-.36.388-.242.708-.572.959-.991V19.37h-.942c-1.006 0-1.75.184-2.232.55-.482.367-.723.917-.723 1.65 0 .566.147 1.016.44 1.352.293.335.702.502 1.226.502ZM125.852 9.536a5.54 5.54 0 0 1 1.697.283l-.912 5.404a5.156 5.156 0 0 0-1.507-.251c-.943 0-1.66.32-2.153.959-.492.639-.874 1.608-1.147 2.907v7.95h-5.593v-16.75h4.871l.502 3.175c.335-1.11.895-2.001 1.681-2.672.786-.67 1.64-1.005 2.561-1.005ZM144.141 18.146c0 .125-.032.754-.094 1.885h-10.245c.147 1.279.508 2.153 1.084 2.625.576.47 1.399.706 2.468.706.628 0 1.251-.12 1.869-.36.618-.242 1.294-.614 2.027-1.116l2.262 3.08a10.483 10.483 0 0 1-3.016 1.743c-1.131.43-2.357.644-3.677.644-2.849 0-5.012-.8-6.489-2.403-1.476-1.603-2.215-3.756-2.215-6.459 0-1.696.309-3.226.927-4.587.617-1.362 1.534-2.44 2.749-3.236 1.215-.797 2.682-1.195 4.4-1.195 2.451 0 4.389.76 5.813 2.278 1.425 1.52 2.137 3.65 2.137 6.395Zm-5.499-1.571c-.021-1.11-.21-1.97-.566-2.577-.356-.608-.953-.911-1.791-.911-.775 0-1.362.272-1.76.817-.398.544-.649 1.498-.754 2.86h4.871v-.19Z"
            fill={props.color}
        />
    </Svg>
);

export default LogoHorizontal;