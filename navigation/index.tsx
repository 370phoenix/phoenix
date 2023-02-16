/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import {
    AuthAction,
    AuthContext,
    authReducer,
    AuthState,
    getUserOnce,
    MessageType,
} from "../firebase/auth";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/SignInScreen";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import ViewPostsScreen from "../screens/ViewPostScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { getAuth, onAuthStateChanged } from "firebase/auth/react-native";
import { Button, Text } from "../components/Themed";
import Colors from "../constants/Colors";
import Type from "../constants/Type";
import { getHeaderTitle } from "@react-navigation/elements";
import Header from "./Header";
import Matches from "../assets/icons/Matches";
import MatchesScreen from "../screens/MatchesScreen";
import { Left } from "../assets/icons/Chevron";
import TabBar from "./TabBar";
import CreateProfileScreen from "../screens/CreateProfileScreen";

export default function Navigation() {
    return (
        <NavigationContainer linking={LinkingConfiguration}>
            <RootNavigator />
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const initialAuth = {
        signedIn: currentUser ? true : false,
        needsInfo: false,
        user: currentUser ? currentUser : null,
    };

    // Reducer in /firebase/auth.ts
    const [authState, authDispatch] = React.useReducer<React.Reducer<AuthState, AuthAction>>(
        authReducer,
        initialAuth as AuthState
    );

    React.useEffect(() => {
        const subscriber = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                try {
                    const userInfo = await getUserOnce(user);
                    if ((userInfo.type = MessageType.info))
                        authDispatch({ type: "COLLECT_INFO", user: user });
                    else authDispatch({ type: "SIGN_IN", user: user });
                } catch (e: any) {
                    console.log(e.message);
                }
            } else {
                // User is signed out
                authDispatch({ type: "SIGN_OUT" });
            }
        });

        // Stop listening to the updates when component unmounts
        return subscriber;
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            <Stack.Navigator
                screenOptions={{
                    header: ({ navigation, route, options }) => {
                        const title = getHeaderTitle(options, route.name);
                        return <Header title={title} options={options} />;
                    },
                }}>
                {authState.signedIn ? (
                    authState.needsInfo ? (
                        <Stack.Screen
                            name="CreateProfile"
                            component={CreateProfileScreen}
                            initialParams={{ authState: authState, authDispatch: authDispatch }}
                        />
                    ) : (
                        <>
                            <Stack.Screen
                                name="Root"
                                component={BottomTabNavigator}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="NotFound"
                                component={NotFoundScreen}
                                options={{ title: "Oops!" }}
                            />
                            <Stack.Screen
                                name="Matches"
                                component={MatchesScreen}
                                options={({ navigation }) => ({
                                    title: "Matches",
                                    headerLeft: () => (
                                        <Button
                                            title="Go back"
                                            onPress={() => navigation.goBack()}
                                            leftIcon={Left}
                                            color="purple"
                                            light
                                            short
                                            clear
                                        />
                                    ),
                                })}
                            />
                            <Stack.Group
                                screenOptions={{ presentation: "modal", headerShown: false }}>
                                <Stack.Screen name="Modal" component={ModalScreen} />
                            </Stack.Group>
                        </>
                    )
                ) : (
                    <>
                        <Stack.Screen
                            name="Welcome"
                            component={WelcomeScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="SignIn"
                            component={SignInScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </AuthContext.Provider>
    );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const auth = getAuth();

    return (
        <BottomTab.Navigator
            initialRouteName="Feed"
            // NOT WORKING due to bug
            tabBar={(props) => <TabBar {...props} />}
            backBehavior="none"
            screenOptions={{
                header: ({ navigation, route, options }) => {
                    const title = getHeaderTitle(options, route.name);
                    return <Header title={title} options={options} />;
                },
                tabBarStyle: {
                    backgroundColor: Colors.navy["3"],
                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    lineHeight: 16,
                    fontFamily: "inter-extrabold",
                    letterSpacing: 1.5,
                },
                tabBarActiveTintColor: Colors.navy["p"],
                tabBarInactiveTintColor: Colors.gray["2"],
            }}>
            <BottomTab.Screen
                name="Feed"
                component={ViewPostsScreen}
                options={({ navigation }: RootTabScreenProps<"Feed">) => ({
                    tabBarIcon: ({ color }) => <TabBarIcon name="rss" color={color} />,
                    headerRight: () => (
                        <Button
                            title=""
                            onPress={() => {
                                navigation.navigate("Matches");
                            }}
                            leftIcon={Matches}
                            color="purple"
                            light
                            short
                            clear
                        />
                    ),
                })}
            />
            <BottomTab.Screen
                name="Profile"
                component={TabTwoScreen}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                    headerRight: () => (
                        <Button
                            title="Sign out"
                            onPress={() => {
                                auth.signOut();
                            }}
                            color="purple"
                            fontSize={16}
                            light
                            short
                            clear
                        />
                    ),
                }}
            />
        </BottomTab.Navigator>
    );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return <FontAwesome size={20} style={{ marginBottom: -5 }} {...props} />;
}
