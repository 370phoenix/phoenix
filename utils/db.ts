import { firebase } from "@react-native-firebase/database";

export const getDB = () => {
    if (__DEV__) {
        return firebase.app().database("https://phoenix-370-test.firebaseio.com");
    } else {
        return firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");
    }
};
