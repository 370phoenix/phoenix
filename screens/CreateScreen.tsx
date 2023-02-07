import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { View, Text, Button } from "../components/Themed";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Create">;

export default function CreateScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text>Create</Text>
            <Button title="Go back" onPress={() => navigation.goBack()} color="blue" light />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    create: {},
    login: {},
});
