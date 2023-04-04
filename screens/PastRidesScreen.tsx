import { StatusBar } from "expo-status-bar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

//import PostList from "../components/posts/PostList";
import PastRidesList from "../components/posts/PastRidesList";
import { View } from "../components/shared/Themed";
import Colors from "../constants/Colors";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "PastRides">;

export default function PastRidesScreen({ route }: Props) {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <PastRidesList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: -20,
        marginBottom: 16,
        backgroundColor: Colors.purple.m,
    },
});

//need to fix bottom of lis
