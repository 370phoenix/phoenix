import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

export default function useKeyboardHeight() {
    const [keySize, setKeySize] = useState(0);

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", (e: any) => {
            const size = e.endCoordinates.height;
            if (Platform.OS === "android") setKeySize(size / 2);
            else setKeySize(size);
        });

        return () => {
            show.remove();
        };
    }, []);

    return keySize;
}
