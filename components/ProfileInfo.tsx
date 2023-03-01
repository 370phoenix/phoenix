import { StyleSheet } from "react-native";
import { View, Text, Spacer, Button } from "../components/Themed";
import Colors from "../constants/Colors";
import { UserInfo } from "../firebase/auth";

type Props = {
    userInfo: UserInfo;
    key: string;
};
export default function ProfileInfo({ userInfo, key }: Props) {
    return (
        <View key={key} style={styles.container}>
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
