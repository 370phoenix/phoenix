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
import { Pressable } from "react-native";

import { AuthAction, AuthContext, authReducer, AuthState } from "../firebase/auth";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/SignInScreen";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import ViewPostsScreen from "../screens/ViewPostScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { getAuth, onAuthStateChanged } from "firebase/auth/react-native";
import { Text } from "../components/Themed";
import Colors from "../constants/Colors";
import Type from "../constants/Type";
import CreatePostScreen from "../screens/CreatePostScreen";

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
        user: currentUser ? currentUser : null,
    };

    // Reducer in /firebase/auth.ts
    const [authState, authDispatch] = React.useReducer<React.Reducer<AuthState, AuthAction>>(
        authReducer,
        initialAuth as AuthState
    );

    React.useEffect(() => {
        const subscriber = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                authDispatch({ type: "SIGN_IN", user: user });
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
            <Stack.Navigator>
                {authState.signedIn ? (
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
                        <Stack.Group screenOptions={{ presentation: "modal" }}>
                            <Stack.Screen name="Modal" component={ModalScreen} />
                        </Stack.Group>
                    </>
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
            initialRouteName="ViewPosts"
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.purple.m,
                },
                headerTintColor: Colors.gray.w,
                headerTitleStyle: Type.header.m,
                tabBarActiveBackgroundColor: Colors.purple.m,
                tabBarInactiveBackgroundColor: Colors.purple.m,
                tabBarActiveTintColor: Colors.gray.w,
                tabBarInactiveTintColor: Colors.gray["3"],
                tabBarStyle: {
                    backgroundColor: Colors.purple.m,
                },
            }}>
            <BottomTab.Screen
                name="ViewPosts"
                component={ViewPostsScreen}
                options={({ navigation }: RootTabScreenProps<"ViewPosts">) => ({
                    title: "View Posts",
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                    headerRight: () => (
                        <Pressable
                            onPress={() => auth.signOut()}
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}>
                            <Text
                                textStyle="label"
                                styleSize="s"
                                style={{
                                    paddingHorizontal: 10,
                                    color: Colors.gray.w,
                                    fontSize: 16,
                                }}>
                                Log out
                            </Text>
                        </Pressable>
                    ),
                })}
            />
            <BottomTab.Screen
                name="TabTwo"
                component={TabTwoScreen}
                options={{
                    title: "Tab 2",
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={{
                    title: "Create Post",
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
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
    return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
