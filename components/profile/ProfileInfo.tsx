import { StyleSheet } from "react-native";
import { View, Text, Spacer } from "../shared/Themed";
import { UserInfo } from "../../utils/auth";

type Props = {
    userInfo: UserInfo;
};
export default function ProfileInfo({ userInfo }: Props) {
    return (
        <View style={styles.container}>
            <Text textStyle="header" styleSize="m">
                {userInfo.username}
            </Text>
            <Spacer direction="column" size={8} />
            <Text textStyle="header" styleSize="s">
                {convertPhone(userInfo.phone)}
            </Text>
            <Spacer direction="column" size={8} />
            <View style={styles.majorGrad}>
                <View style={styles.grad}>
                    <Text textStyle="label" styleSize="l">
                        Grad Year
                    </Text>
                    <Text textStyle="label" styleSize="m">
                        {userInfo.gradYear}{" "}
                    </Text>
                </View>
                <View style={styles.major}>
                    <Text textStyle="label" styleSize="l">
                        Major
                    </Text>
                    <Text textStyle="label" styleSize="m">
                        {userInfo.major}{" "}
                    </Text>
                </View>
            </View>

            <Spacer direction="column" size={8} />
            <Text textStyle="label" styleSize="l">
                Gender
            </Text>

            <Text textStyle="label" styleSize="m">
                {userInfo.gender}
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
    },
    grad: {
        flex: 1,
        //alignItems: "center",
        //justifyContent: "center",
    },
    major: {
        flex: 1,
        alignItems: "flex-start",
        //justifyContent: "center",
    },
    majorGrad: {
        flex: 1,
        //alignItems: "center
        //justifyContent: "center",
        flexDirection: "row",
        alignItems: "flex-start",
    },
});
