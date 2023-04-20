import functions from "@react-native-firebase/functions";

export const getFunctions = () => {
    if (__DEV__) {
        // REPLACE THIS WITH YOUR IP ADDRESS AND SWICH BACK BEFORE MERGING
        functions().useEmulator("10.44.19.51", 5001);
        return functions();
    } else return functions();
};
