import { Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Button, Text, View } from "./Themed";

type Props = NativeStackScreenProps<RootStackParamList, "Matches">;
export default function MatchButton({ navigation }: Props) {
    const createTwoButtonAlert = () =>
        Alert.alert("Alert Title", "My Alert Msg", [
            {
                text: "Deny",
                onPress: () => console.log("Match Denied"),
                style: "cancel",
            },
            { text: "Accept", onPress: () => console.log("Match Accepted") },
        ]);

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text> Match </Text>
            <Button
                title="post"
                onPress={() => {
                    createTwoButtonAlert;
                    navigation.navigate("Matches");
                }}
                color="purple"
            />
        </View>
    );
}
