import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createContext } from "react";
import { assign, createMachine, InterpreterFrom } from "xstate";
import { getUserUpdates, UserInfo } from "../auth";
import { fetchSomePosts } from "../posts";
import { registerForPushNotificationsAsync } from "../notifications";
import { PostType } from "../postValidation";
import { logError } from "../errorHandling";

const AuthMachine = {
    id: "New Authentication Machine",
    invoke: {
        src: "setUserListener",
        id: "setUserListener",
    },
    initial: "Init",
    states: {
        "Init": {
            always: [
                {
                    target: "FB Signed In",
                    cond: "userExists",
                },
                {
                    target: "FB Signed Out",
                },
            ],
        },
        "FB Signed In": {
            invoke: {
                src: "setUserInfoListener",
                id: "setUserInfoListener",
            },
            on: {
                "SIGN OUT": {
                    target: "#New Authentication Machine.Init",
                    actions: "clearInfo",
                },
            },
            initial: "Init",
            states: {
                "Init": {
                    always: [
                        { target: "Waiting", cond: "noRunYet" },
                        {
                            target: "Info Updated",
                            cond: "userInfoExists",
                        },
                        {
                            target: "Needs Profile",
                        },
                    ],
                },
                "Waiting": {
                    on: {
                        "USER INFO CHANGED": {
                            target: "Init",
                            actions: "assignUserInfo",
                        },
                    },
                },
                "Info Updated": {
                    initial: "Start",
                    on: {
                        "USER INFO CHANGED": {
                            target: "Init",
                            actions: "assignUserInfo",
                        },
                    },
                    states: {
                        "Start": {
                            always: [
                                {
                                    target: "Set Token in DB",
                                    cond: "noTokenSet",
                                },
                                {
                                    target: "Loading User Posts",
                                    cond: "postsChanged",
                                },
                                {
                                    target: "Posts Loaded",
                                },
                            ],
                        },
                        "Loading User Posts": {
                            invoke: {
                                id: "loadUsersPosts",
                                src: "loadUserPosts",
                                onDone: {
                                    actions: "assignPosts",
                                    target: "Posts Loaded",
                                },
                                onError: {
                                    actions: "logError",
                                    target: "Loading Failed",
                                },
                            },
                        },
                        "Posts Loaded": {},
                        "Loading Failed": {},
                        "Set Token in DB": {
                            invoke: {
                                src: "setToken",
                                id: "setToken",
                                onDone: {
                                    target: "Start",
                                    actions: "updateUserInfoTokenSet",
                                },
                                onError: {
                                    target: "Start",
                                    actions: "logError",
                                },
                            },
                            on: {
                                "USER INFO CHANGED": {
                                    target: "#New Authentication Machine.Init",
                                    actions: "assignUserInfo",
                                },
                            },
                        },
                    },
                },
                "Needs Profile": {
                    on: {
                        "USER INFO CHANGED": {
                            target: "Init",
                            actions: "assignUserInfo",
                        },
                    },
                },
            },
        },
        "FB Signed Out": {
            on: {
                "USER CHANGED": {
                    target: "Init",
                    actions: "assignUser",
                },
            },
        },
    },
    context: {
        user: null,
        userInfo: null,
        ranOnce: false,
        error: null,
        posts: null,
        hasPushToken: false,
    },
    schema: {
        context: {} as AuthMachineContext,
        events: {} as AuthMachineEvents,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

type AuthMachineContext = {
    user: FirebaseAuthTypes.User | null;
    userInfo: UserInfo | null;
    ranOnce: boolean;
    error: string | null;
    posts: PostType[] | null;
    hasPushToken: boolean;
};

type AuthMachineEvents =
    | { type: "USER CHANGED"; user: FirebaseAuthTypes.User | null }
    | { type: "USER INFO CHANGED"; userInfo: UserInfo | null }
    | { type: "SIGN OUT" };

export const stateSelector = (state: any) => state;
export const signedInSelector = (state: any) => state.matches("FB Signed In");
export const needsInfoSelector = (state: any) =>
    ["FB Signed In.Needs Profile", "FB Signed In.Waiting"].some(state.matches);
export const userIDSelector = (state: any) =>
    state.context.user ? (state.context.user.uid as string) : null;
export const userInfoSelector = (state: any) =>
    state.context.userInfo ? (state.context.userInfo as UserInfo) : null;
export const userPostsSelector = (state: any) =>
    state.context.posts ? (state.context.posts as PostType[]) : null;
export const userSelector = (state: any) =>
    state.context.user ? (state.context.user as FirebaseAuthTypes.User) : null;

export const authMachine = createMachine(AuthMachine, {
    services: {
        setUserListener: () => (callback) => {
            const authSubscriber = auth().onAuthStateChanged((user) => {
                if (user) callback({ type: "USER CHANGED", user: user });
                else callback({ type: "SIGN OUT" });
            });

            return authSubscriber;
        },
        setUserInfoListener: (context) => (callback) => {
            if (!context.user) {
                console.log("MISSING USER IN FB SIGNED IN");
                return () => {};
            }
            try {
                return getUserUpdates(context.user.uid, (data) => {
                    callback({ type: "USER INFO CHANGED", userInfo: data });
                });
            } catch (e: any) {
                logError(e);
                return () => {};
            }
        },
        loadUserPosts: async (context) => {
            const { user, userInfo } = context;
            if (!user || !userInfo) throw Error("Missing User Information");
            const { posts: postIDs } = userInfo;
            if (!postIDs) return [];

            return await fetchSomePosts(postIDs);
        },
        setToken: async (context) => {
            const { user, userInfo } = context;
            if (!user || !userInfo) throw Error("Missing User Information");
            try {
                await registerForPushNotificationsAsync(user.uid, userInfo);
            } catch (e: any) {
                throw Error("Error registering for push notifications");
            }
        },
    },
    actions: {
        assignUser: assign({
            user: (context, event) =>
                event.type === "USER CHANGED"
                    ? event.user
                        ? event.user
                        : context.user
                    : context.user,
        }),
        assignUserInfo: assign({
            ranOnce: true,
            userInfo: (context, event) =>
                event.type === "USER INFO CHANGED" ? event.userInfo : context.userInfo,
        }),
        clearInfo: assign({
            user: null,
            userInfo: null,
            ranOnce: false,
        }),
        assignPosts: assign({
            posts: (_, event: any) => event.data,
        }),
        updateUserInfoTokenSet: assign({
            hasPushToken: true,
            userInfo: (context, event: any) => {
                if (event.type !== "USER INFO CHANGED" && context.userInfo)
                    return { ...context.userInfo, hasPushToken: true };
                if (event.type === "USER INFO CHANGED" && !event.userInfo) return null;
                return { ...event.userInfo, hasPushToken: true };
            },
        }),
        logError: (_, event: any) => logError(event.data),
    },
    guards: {
        userExists: (context) => (context.user ? true : false),
        userInfoExists: (context) => (context.userInfo ? true : false),
        noRunYet: (context) => context.ranOnce === false,
        postsChanged: (context) => checkPostChanges(context),
        noTokenSet: (context) => !context.hasPushToken,
    },
});

function checkPostChanges(context: AuthMachineContext) {
    const { userInfo, posts } = context;
    if (!userInfo) return false;
    if (!posts) return true;
    if (!userInfo.posts) return true;
    const postIDs = posts.map((post) => post.postID);

    // Check for changes in old posts
    for (const id of postIDs) {
        if (!userInfo.posts.includes(id)) return true;
    }

    // Check for changes in new posts
    for (const id of userInfo.posts) {
        if (!postIDs.includes(id)) return true;
    }

    return false;
}

export const AuthContext = createContext({} as InterpreterFrom<typeof authMachine>);
