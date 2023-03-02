import { StyleSheet } from "react-native";
import { View, Text, Spacer } from "../shared/Themed";
import { UserInfo } from "../../utils/auth";
import Colors from "../../constants/Colors";
import GradCap from "../../assets/icons/GradCap";
import Gender from "../../assets/icons/Gender";
import Book from "../../assets/icons/Book";
import { SvgProps } from "react-native-svg";

type Props = {
    userInfo: UserInfo;
};
export default function ProfileInfo({ userInfo }: Props) {
    const iconSize = 30;
    const iconColor = Colors.gray.w;
    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 12 }}>
                <Text textStyle="header" styleSize="m" style={styles.purple}>
                    {userInfo.username}
                </Text>
                <Text textStyle="lineTitle" style={styles.purple}>
                    {convertPhone(userInfo.phone)}
                </Text>
            </View>
            <InfoRow icon={GradCap} text={String(userInfo.gradYear)} />
            <InfoRow icon={Book} text={userInfo.major} />
            <InfoRow icon={Gender} text={userInfo.gender} />
        </View>
    );
}

type InfoProps = {
    icon: (props: SvgProps) => JSX.Element;
    text: string;
};
function InfoRow({ icon, text }: InfoProps) {
    const props = {
        height: 30,
        width: 30,
        color: Colors.purple.p,
    };
    return (
        <View style={styles.infoRow}>
            {icon(props)}
            <Text textStyle="label" style={styles.infoText}>
                {text}
            </Text>
        </View>
    );
}

function convertPhone(number: string) {
    //let newString = new string;

    //if (number.length > 11) {
    //    newString = number.slice(2, 5) - number.slice(5, 8) - number.slice(8, 12);
    //}

    return "(" + number.slice(2, 5) + ")" + "-" + number.slice(5, 8) + "-" + number.slice(8, 12);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 16,
        backgroundColor: Colors.gray.w,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        borderRadius: 8,
    },
    infoRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    infoText: {
        color: Colors.purple.p,
        paddingLeft: 24,
    },
    purple: {
        color: Colors.purple.p,
    },
});
