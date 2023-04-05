import { Platform, UIManager } from "react-native";

export function enableLayoutAnimation() {
    if (Platform.OS === "android") {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
}
