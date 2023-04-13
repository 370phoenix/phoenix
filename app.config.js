export default {
    expo: {
        name: "FareShare - Save $",
        slug: "phoenix",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/Icon_biggish.png",
        scheme: "fareshare",
        userInterfaceStyle: "automatic",
        splash: {
            image: "./assets/images/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
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
            infoPlist: {
                CFBundleURLTypes: [
                    {
                        CFBundleTypeRole: "Editor",
                        CFBundleURLSchemes: [
                            "fareshare",
                            "com.googleusercontent.apps.816203081042-dlkok6863f27oe8j4u2b29mgaf8jus6g",
                        ],
                    },
                ],
            },
        },
        android: {
            googleServicesFile: process.env.ANDROID_GOOGLE
                ? process.env.ANDROID_GOOGLE
                : "./google-services.json",
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
            package: "com.willtheodore.phoenix",
        },
        web: {
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "@react-native-firebase/auth",
            "@react-native-firebase/app",
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
