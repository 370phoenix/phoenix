import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createContext } from "react";
import { assign, createMachine, DoneInvokeEvent, InterpreterFrom } from "xstate";
import { UserID } from "../../constants/DataTypes";
import { checkUserInfo, getUserUpdates, UserInfo } from "../auth";

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
                        "SIGN OUT": {
                            target: "#New Authentication Machine.Init",
                            actions: "clearInfo",
                        },
                    },
                },
                "Info Updated": {
                    on: {
                        "USER INFO CHANGED": {
                            target: "Init",
                            actions: "assignUserInfo",
                        },
                        "SIGN OUT": {
                            target: "#New Authentication Machine.Init",
                            actions: "clearInfo",
                        },
                    },
                },
                "Needs Profile": {
                    on: {
                        "SIGN OUT": {
                            target: "#New Authentication Machine.Init",
                            actions: "clearInfo",
                        },
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
    context: { user: null, userInfo: null, ranOnce: false },
    schema: {
        context: {} as AuthMachineContext,
        events: {} as AuthMachineEvents,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

type AuthMachineContext = {
    user: string | null;
    userInfo: UserInfo | null;
    ranOnce: boolean;
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
    state.context.user ? (state.context.user.uid as UserID) : null;
export const userInfoSelector = (state: any) =>
    state.context.userInfo ? (state.context.userInfo as UserInfo) : null;

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
            const res = getUserUpdates(context.user, (data) => {
                callback({ type: "USER INFO CHANGED", userInfo: data });
            });

            if (typeof res === "string") return () => {};

            return res;
        },
    },
    actions: {
        assignUser: assign({
            user: (context, event) =>
                event.type === "USER CHANGED"
                    ? event.user
                        ? event.user.uid
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
    },
    guards: {
        userExists: (context) => (context.user ? typeof context.user === "string" : false),
        userInfoExists: (context) =>
            context.userInfo ? typeof context.userInfo === "object" : false,
        noRunYet: (context) => context.ranOnce == false,
    },
});

export const AuthContext = createContext({} as InterpreterFrom<typeof authMachine>);
