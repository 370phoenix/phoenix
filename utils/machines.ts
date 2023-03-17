import { createContext } from "react";
import { assign, createMachine, DoneInvokeEvent, InterpreterFrom } from "xstate";
import { UserID } from "../constants/DataTypes";
import { checkUserInfo, getUserOnce, UserInfo } from "./auth";

export type AuthMachineContext = {
    user: UserID | null;
    userInfo: UserInfo | null;
    obj: UserID | UserInfo | null;
};

const AuthMachine = {
    schema: {
        context: {} as AuthMachineContext,
        events: {} as
            | { type: "Sign Out" }
            | { type: "INFO CHANGED"; obj: UserID | UserInfo | null },
        guards: {} as
            | { type: "userInfoExists" }
            | { type: "shouldCheckInfo" }
            | { type: "objExists" }
            | { type: "firstLoad" },
    },
    context: { user: null, userInfo: null, obj: null },
    predictableActionArguments: true,
    preserveActionOrder: true,
    id: "Authentication Machine",
    initial: "Initial",
    states: {
        "Initial": {
            always: {
                target: "Checking Updates",
            },
        },
        "Signed In": {
            on: {
                "Sign Out": {
                    target: "Signing Out",
                    actions: [assign({ user: null }), assign({ userInfo: null })],
                },
                "INFO CHANGED": {
                    target: "Checking Updates",
                    actions: assign((_, event: any) => ({
                        obj: event.obj,
                    })),
                },
            },
        },
        "Create Profile Screen": {
            on: {
                "INFO CHANGED": {
                    target: "Checking Updates",
                    actions: assign((_, event: any) => ({
                        obj: event.obj,
                    })),
                },
            },
        },
        "Checking Updates": {
            initial: "Start",
            states: {
                "Checking User Info": {
                    invoke: {
                        id: "getUserInfo",
                        src: (context: AuthMachineContext) =>
                            checkUserInfo(context.user ? context.user : undefined),
                        onDone: [
                            {
                                target: "#Authentication Machine.Signed In",
                                cond: { type: "userInfoExists" },
                                actions: assign(
                                    (
                                        _,
                                        event: DoneInvokeEvent<[UserID, UserInfo | undefined]>
                                    ) => ({
                                        user: event.data[0],
                                        userInfo: event.data[1],
                                    })
                                ),
                            },
                            {
                                target: "#Authentication Machine.Create Profile Screen",
                                actions: assign(
                                    (
                                        _,
                                        event: DoneInvokeEvent<[UserID, UserInfo | undefined]>
                                    ) => ({
                                        user: event.data[0],
                                    })
                                ),
                            },
                        ],
                        onError: {
                            target: "Start",
                        },
                    },
                },
                "Start": {
                    always: [
                        {
                            target: "Checking User Info",
                            cond: { type: "shouldCheckInfo" },
                            actions: [
                                assign((context: any, _) => ({
                                    user: context.obj as UserID,
                                })),
                            ],
                        },
                        {
                            target: "#Authentication Machine.Welcome Screen",
                            cond: { type: "objExists" },
                            actions: [
                                assign((context: any, _) => ({
                                    userInfo: context.obj as UserInfo,
                                })),
                            ],
                        },
                        {
                            target: "#Authentication Machine.Welcome Screen",
                        },
                    ],
                },
            },
        },
        "Signing Out": {
            invoke: {
                src: "signOut",
                id: "signOut",
                onDone: [
                    {
                        target: "Initial",
                    },
                ],
                onError: [
                    {
                        target: "Initial",
                        description: "fails silently in prod",
                    },
                ],
            },
        },
        "Welcome Screen": {
            on: {
                "INFO CHANGED": {
                    target: "Checking Updates",
                    actions: assign((_, event: any) => ({
                        obj: event.obj,
                    })),
                },
            },
        },
    },
};

export const signedInSelector = (state: any) => state.matches("Signed In");
export const needsInfoSelector = (state: any) => state.matches("Create Profile Screen");
export const userIDSelector = (state: any) =>
    state.context.user ? (state.context.user as UserID) : null;

export const userInfoSelector = (state: any) =>
    state.context.userInfo ? (state.context.userInfo as UserInfo) : null;

export const authMachine = createMachine(AuthMachine, {
    guards: {
        userInfoExists: (_, event: any) => {
            console.log(event);
            return event.data && event.data[1] !== undefined;
        },
        shouldCheckInfo: (context, _) => {
            if (!context.obj) return true;
            if (typeof context.obj != "string") return false;
            return true;
        },
        objExists: (context, _) => context.obj !== undefined && context.obj !== null,
    },
    // TODO: Add services
});

export const AuthContext = createContext({} as InterpreterFrom<typeof authMachine>);
