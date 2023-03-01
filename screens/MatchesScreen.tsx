import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import MatchList from "../components/MatchList";
import { getAuth } from "firebase/auth/react-native";

export default function MatchesScreen() {
    const auth = getAuth();
    if (!auth.currentUser)
        return (
            <View style={styles.container}>
                <Text textStyle="label" style={styles.err}>
                    Could not find current user
                </Text>
            </View>
        );
    return (
        <View style={styles.container}>
            <MatchList user={auth.currentUser} />
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
