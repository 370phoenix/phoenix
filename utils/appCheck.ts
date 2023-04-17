import { firebase } from "@react-native-firebase/app-check";

export const rnfbProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider();
rnfbProvider.configure({
    android: {
        provider: __DEV__ ? "debug" : "playIntegrity",
        debugToken: process.env.ANDROID_APP_CHECK_DEBUG_TOKEN,
    },
    apple: {
        provider: __DEV__ ? "debug" : "appAttest",
        debugToken: process.env.IOS_APP_CHECK_DEBUG_TOKEN,
    },
});
