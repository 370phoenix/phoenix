/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ChatHeader } from "./utils/chat";
import { FBPostType } from "./utils/postValidation";
import { UserInfo } from "./utils/userValidation";
import { PostType } from "./utils/postValidation";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export type RootStackParamList = {
    Root: NavigatorScreenParams<RootTabParamList> | undefined;
    ChangeInfo: ChangeInfoParamList | undefined;
    Matches: undefined;
    NotFound: undefined;
    Welcome: undefined;
    SignIn: undefined;
    CreateProfile: CreateProfileParamList | undefined;
    PostDetails: PostDetailsParamList | undefined;
    PastPostDetails: PastPostDetailsParamList | undefined;
    CreatePost: undefined;
    PastRides: undefined;
    ChatScreen: ChatScreenParamList | undefined;
    Error: undefined;
    Waiting: undefined;
};

export type ChatScreenParamList = {
    post: FBPostType;
    header: ChatHeader;
};

export type PostDetailsParamList = {
    post: FBPostType;
};

export type PastPostDetailsParamList = {
    post: FBPostType;
};

export type ChangeInfoParamList = {
    userInfo: UserInfo;
};

export type CreateProfileParamList = object;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    Screen
>;

export type RootTabParamList = {
    Feed: undefined;
    Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
>;
