/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserInfo } from "./utils/auth";
import { PostType } from "./constants/DataTypes";
import { MatchSublist } from "./components/matches/MatchList";

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
    CreatePost: undefined;
    MatchDetails: MatchDetailsParamList | undefined;
};

export type MatchDetailsParamList = {
    post: PostType;
    list: MatchSublist;
};

export type PostDetailsParamList = {
    post: PostType;
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
