import { Button } from "../shared/Themed";
import { Left } from "../../assets/icons/Chevron";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";

interface Props {
    navigation: NavigationProp<RootStackParamList>;
}
export default function GoBackButton({ navigation }: Props) {
    return (
        <Button
            title="Back"
            onPress={() => navigation.goBack()}
            leftIcon={Left}
            color="purple"
            iconSize={25}
            iconReduce={-8}
            light
            short
            clear
        />
    );
}
