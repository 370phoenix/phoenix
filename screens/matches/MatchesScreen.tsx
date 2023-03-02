import { StyleSheet } from "react-native";

import { Text, View } from "../../components/shared/Themed";
import Colors from "../../constants/Colors";
import MatchList from "../../components/matches/MatchList";
import auth from "@react-native-firebase/auth";

export default function MatchesScreen() {
    const currentUser = auth().currentUser;
    if (!currentUser)
        return (
            <View style={styles.container}>
                <Text textStyle="label" style={styles.err}>
                    Could not find current user
                </Text>
            </View>
        );
    return (
        <View style={styles.container}>
            <MatchList user={currentUser} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray[4],
        marginTop: -20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
    err: {
        color: Colors.red.p,
    },
});
