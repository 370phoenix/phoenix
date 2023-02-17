import { FontAwesome } from "@expo/vector-icons";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { RootStackParamList } from "../types";
import { Button, View } from "./Themed";

type Props = {
    navigation: NativeStackNavigationProp<ParamListBase>;
};
export default function ModalHeader({ navigation }: Props) {
    return (
        <View style={styles.header}>
            <Button
                title=""
                onPress={() => navigation.goBack()}
                clear
                short
                color="gray"
                leftIcon={() => <FontAwesome size={30} name="times-circle" color={Colors.red.p} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#F9F9F9",
        width: "100%",
        paddingVertical: 16,
        flexDirection: "row",
        paddingHorizontal: 16,
        zIndex: 100,
    },
});
