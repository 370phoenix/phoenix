import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import WelcomeScreen from "../screens/auth/WelcomeScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import ViewPostsScreen from "../screens/PostFeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Button } from "../components/shared/Themed";
import Colors from "../constants/Colors";
import { getHeaderTitle } from "@react-navigation/elements";
import Header from "./Header";
import openBook from "../assets/icons/openBook";
import Matches from "../assets/icons/Matches";
import MatchesScreen from "../screens/matches/MatchesScreen";
import { Left } from "../assets/icons/Chevron";
import TabBar from "./TabBar";
import CreateProfileScreen from "../screens/auth/CreateProfileScreen";
import ChangeInfoScreen from "../screens/modals/ChangeInfoScreen";
import CreatePostScreen from "../screens/modals/CreatePostScreen";
import PostDetailsScreen from "../screens/modals/PostDetailsScreen";
import ModalHeader from "../components/shared/ModalHeader";
import ChatScreen from "../screens/matches/ChatScreen";
import auth from "@react-native-firebase/auth";
import { useSelector } from "@xstate/react";
import {
    AuthContext,
    needsInfoSelector,
    signedInSelector,
    waitingSelector,
} from "../utils/machines/authMachine";
import ErrorScreen from "../screens/ErrorScreen";
import WaitingScreen from "../screens/WaitingScreen";

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
    const authService = React.useContext(AuthContext);
    const signedIn = useSelector(authService, signedInSelector);
    const needsInfo = useSelector(authService, needsInfoSelector);
    const waiting = useSelector(authService, waitingSelector);
    const error = useSelector(authService, (state) => state.context.error);

    const welcome = (
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
                    animationTypeForReplace: signedIn ? "push" : "pop",
                }}
            />
        </>
    );

    const waitingContent = <Stack.Screen name="Waiting" component={WaitingScreen} />;

    const needsInfoContent = (
        <Stack.Screen name="CreateProfile">
            {(props) => <CreateProfileScreen {...props} />}
        </Stack.Screen>
    );

    const errorContent = <Stack.Screen name="Error" component={ErrorScreen} />;

    let content;
    if (error) content = errorContent;
    else if (!signedIn) content = welcome;
    else if (waiting) content = waitingContent;
    else if (needsInfo) content = needsInfoContent;
    else
        content = (
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
                    name="ChatScreen"
                    component={ChatScreen}
                    options={({ navigation }) => ({
                        title: "Chat Screen",
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
                        header: ({ navigation }) => <ModalHeader navigation={navigation} />,
                    }}>
                    <Stack.Screen name="ChangeInfo" component={ChangeInfoScreen} />
                    <Stack.Screen name="CreatePost" component={CreatePostScreen} />
                    <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
                </Stack.Group>
            </>
        );

    return (
        <Stack.Navigator
            screenOptions={{
                header: ({ route, options }) => {
                    const title = getHeaderTitle(options, route.name);
                    return <Header title={title} options={options} />;
                },
            }}>
            {content}
        </Stack.Navigator>
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
            tabBar={(props) => <TabBar {...props} />}
            backBehavior="none"
            screenOptions={{
                header: ({ route, options }) => {
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
                    headerLeft: () => (
                        <Button
                            title=""
                            onPress={() => {
                                navigation.navigate("PastRides");
                            }}
                            leftIcon={openBook}
                            color="purple"
                            light
                            short
                            clear
                            style={{
                                height: 17,
                            }}
                        />
                    ),
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
                                auth().signOut();
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
