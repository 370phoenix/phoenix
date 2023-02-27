import type { Config } from "jest";

const config: Config = {
    verbose: true,

    preset: "jest-expo",
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|firebase)",
    ],
    roots: ["<rootDir>"],
    modulePaths: ["<rootDir>"],
    moduleDirectories: ["node_modules"],
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{js,jsx, ts, tsx}",
        "!**/coverage/**",
        "!**/node_modules/**",
        "!**/babel.config.js",
        "!**/jest.setup.js",
    ],
};

export default config;
