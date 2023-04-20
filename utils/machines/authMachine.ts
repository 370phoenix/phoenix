import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createContext } from "react";
import { assign, createMachine, InterpreterFrom } from "xstate";
import { getUserUpdates } from "../auth";
import { fetchSomePosts } from "../posts";
import { registerForPushNotificationsAsync } from "../notifications";
import { UserInfo } from "../userValidation";
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
        "Signing Out": {
            invoke: {
                src: "signOut",
                id: "signOut",
                onDone: {
                    target: "FB Signed Out",
                },
                onError: {
                    target: "FB Signed Out",
                },
            },
        },
        "FB Signed In": {
            invoke: {
                src: "setUserInfoListener",
                id: "setUserInfoListener",
            },
            on: {
                "USER CHANGED": {
                    target: "#New Authentication Machine.Init",
                    actions: "assignUser",
                },
                "SIGN OUT": {
                    target: "#New Authentication Machine.Signing Out",
                    actions: "clearInfo",
                },
            },
            initial: "Init",
            states: {
                "Init": {
                    always: [
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
                        "ERROR": {
                            target: "Init",
                            actions: "assignError",
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
                        "ERROR": {
                            target: "Init",
                            actions: "assignError",
                        },
                    },
                    states: {
                        "Start": {
                            always: [
                                {
                                    target: "Set Token in DB",
                                    cond: "needTokenUpdate",
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
                        "Posts Loaded": {
                            on: {
                                "UPDATE POST": {
                                    target: "Posts Loaded",
                                    actions: "updatePost",
                                },
                            },
                        },
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
                                    actions: "assignError",
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
                        "ERROR": {
                            target: "Init",
                            actions: "assignError",
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
        updatedToken: false,
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
    error: Error | null;
    posts: PostType[] | null;
    updatedToken: boolean;
};

type AuthMachineEvents =
    | { type: "USER CHANGED"; user: FirebaseAuthTypes.User | null }
    | { type: "USER INFO CHANGED"; userInfo: UserInfo | null }
    | { type: "SIGN OUT" }
    | { type: "UPDATE POST"; post: PostType }
    | { type: "ERROR"; error: Error };

export const stateSelector = (state: any) => state;
export const signedInSelector = (state: any) => state.matches("FB Signed In");
export const needsInfoSelector = (state: any) => state.matches("FB Signed In.Needs Profile");
export const waitingSelector = (state: any) => state.matches("FB Signed In.Waiting");
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
        signOut: () => async () => {
            await auth().signOut();
        },
        setUserInfoListener: (context) => (callback) => {
            if (!context.user) {
                console.log("MISSING USER IN FB SIGNED IN");
                return () => {};
            }
            try {
                return getUserUpdates(
                    context.user.uid,
                    (data) => {
                        callback({ type: "USER INFO CHANGED", userInfo: data });
                    },
                    (error) => callback({ type: "ERROR", error })
                );
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

            return await fetchSomePosts(Object.keys(postIDs));
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
            user: (_, event) => {
                if (event.type !== "USER CHANGED") return null;
                console.log("ASSIGNING USER: ", event.user ? event.user.uid : "null");
                return event.user;
            },
        }),
        assignUserInfo: assign({
            ranOnce: true,
            userInfo: (context, event) =>
                event.type === "USER INFO CHANGED" ? event.userInfo : context.userInfo,
            error: null,
        }),
        clearInfo: assign({
            user: null,
            userInfo: null,
            ranOnce: false,
            error: null,
            posts: null,
            updatedToken: false,
        }),
        assignPosts: assign({
            posts: (_, event: any) => event.data,
        }),
        updatePost: assign({
            error: (_, event) =>
                event.type === "UPDATE POST" && !event.post ? Error("Missing Post") : null,
            posts: (context, event) => {
                if (event.type !== "UPDATE POST") return context.posts;
                if (!event.post) return context.posts;
                if (!context.posts) return context.posts;

                const i = context.posts.findIndex((post) => post.postID === event.post.postID);
                if (i === -1) return context.posts;

                const newPosts = [...context.posts];
                newPosts[i] = event.post;
                return newPosts;
            },
        }),
        updateUserInfoTokenSet: assign({
            updatedToken: true,
        }),
        assignError: assign({
            ranOnce: true,
            userInfo: null,
            updatedToken: true,
            error: (_, event: any) => (event.type === "ERROR" ? event.error : null),
        }),
        logError: (_, event: any) => logError(event.data),
    },
    guards: {
        userExists: (context) => (context.user ? true : false),
        userInfoExists: (context) => (context.userInfo ? true : false),
        noRunYet: (context) => context.ranOnce === false,
        postsChanged: (context) => checkPostChanges(context),
        needTokenUpdate: (context) => context.updatedToken === false,
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
        return userInfo.posts[id] === true;
    }

    // Check for changes in new posts
    for (const id of Object.keys(userInfo.posts)) {
        if (!postIDs.includes(id)) return true;
    }

    return false;
}

export const AuthContext = createContext({} as InterpreterFrom<typeof authMachine>);
