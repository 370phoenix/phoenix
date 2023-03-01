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
} from "../utils/auth";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import ViewPostsScreen from "../screens/PostFeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { onAuthStateChanged } from "firebase/auth/react-native";
import { Button } from "../components/shared/Themed";
import Colors from "../constants/Colors";
import { getHeaderTitle } from "@react-navigation/elements";
import Header from "./Header";
import Matches from "../assets/icons/Matches";
import MatchesScreen from "../screens/matches/MatchesScreen";
import { Left } from "../assets/icons/Chevron";
import TabBar from "./TabBar";
import CreateProfileScreen from "../screens/auth/CreateProfileScreen";
import ChangeInfoScreen from "../screens/modals/ChangeInfoScreen";
import CreatePostScreen from "../screens/modals/CreatePostScreen";
import PostDetailsScreen from "../screens/modals/PostDetailsScreen";
import ModalHeader from "../components/shared/ModalHeader";
import { auth } from "../firebaseConfig";
import MatchDetailsScreen from "../screens/matches/MatchDetailsScreen";

export default function Navigation() {
    return (
        <NavigationContainer linking={LinkingConfiguration}>
            <RootNavigator />
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top ofall other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
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
                    const userInfo = await getUserOnce(user.uid);
                    if (userInfo.type === MessageType.info)
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
                        <Stack.Screen name="CreateProfile">
                            {(props) => (
                                <CreateProfileScreen {...props} authDispatch={authDispatch} />
                            )}
                        </Stack.Screen>
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
                            <Stack.Screen
                                name="MatchDetails"
                                component={MatchDetailsScreen}
                                options={({ navigation }) => ({
                                    title: "Match Details",
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
                                screenOptions={{
                                    presentation: "modal",
                                    header: ({ navigation }) => (
                                        <ModalHeader navigation={navigation} />
                                    ),
                                }}>
                                <Stack.Screen name="ChangeInfo" component={ChangeInfoScreen} />
                                <Stack.Screen name="CreatePost" component={CreatePostScreen} />
                                <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
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
                            options={{
                                headerShown: false,
                                animationTypeForReplace: authState.signedIn ? "push" : "pop",
                            }}
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
                component={ProfileScreen}
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
