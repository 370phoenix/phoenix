export default {
    expo: {
        name: "FareShare - Save",
        slug: "phoenix",
        version: "1.0.2",
        orientation: "portrait",
        icon: "./assets/images/Icon_biggish.png",
        scheme: "fareshare",
        userInterfaceStyle: "automatic",
        splash: {
            image: "./assets/images/splash_carDark.png",
            resizeMode: "contain",
            backgroundColor: "#744a93",
        },
        jsEngine: "hermes",
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ["**/*"],
        ios: {
            googleServicesFile: process.env.IOS_GOOGLE
                ? process.env.IOS_GOOGLE
                : "./GoogleService-Info.plist",
            supportsTablet: true,
            bundleIdentifier: "com.willtheodore.phoenix",
        },
        android: {
            googleServicesFile: process.env.ANDROID_GOOGLE
                ? process.env.ANDROID_GOOGLE
                : "./google-services.json",
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon_smallish.png",
                backgroundColor: "#744a93",
            },
            package: "com.willtheodore.phoenix",
        },
        plugins: [
            "@react-native-firebase/auth",
            "@react-native-firebase/app",
            "@react-native-firebase/crashlytics",
            "@react-native-firebase/perf",
            [
                "expo-build-properties",
                {
                    ios: {
                        useFrameworks: "static",
                    },
                },
            ],
        ],
        extra: {
            eas: {
                projectId: "4a57037e-bdc6-4bca-9d01-81d13c8e96e9",
            },
        },
    },
};
