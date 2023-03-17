import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { userInfo } from "os";
import { assign, DoneInvokeEvent } from "xstate";
import { UserID } from "../constants/DataTypes";
import { getUserOnce, UserInfo } from "./auth";

export type AuthMachineContext = {
    user: UserID | null;
    userInfo: UserInfo | null;
    obj: FirebaseAuthTypes.User | UserInfo | null;
};

export const AuthMachine = {
    schema: {
        context: {} as AuthMachineContext,
        events: {} as
            | { type: "Sign Out" }
            | { type: "INFO CHANGED"; obj: FirebaseAuthTypes.User | UserInfo | null },
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
                    actions: assign((context, event: any) => {
                        obj: event.obj;
                    }),
                },
            },
        },
        "Create Profile Screen": {
            on: {
                "INFO CHANGED": {
                    target: "Checking Updates",
                    actions: assign((context, event: any) => {
                        obj: event.obj;
                    }),
                },
            },
        },
        "Checking Updates": {
            initial: "Start",
            states: {
                "Checking User Info": {
                    invoke: {
                        id: "getUserInfo",
                        src: (context: AuthMachineContext, event: any) =>
                            getUserOnce(context.user!),
                        onDone: [
                            {
                                target: "#Authentication Machine.Signed In",
                                cond: "resultExists",
                                actions: assign({
                                    userInfo: (context, event: DoneInvokeEvent<UserInfo>) =>
                                        event.data,
                                }),
                            },
                            {
                                target: "#Authentication Machine.Create Profile Screen",
                            },
                        ],
                    },
                },
                "Start": {
                    always: [
                        {
                            target: "Checking User Info",
                            cond: "shouldCheckInfo",
                            actions: "assignUser",
                        },
                        {
                            target: "#Authentication Machine.Welcome Screen",
                            cond: "objExists",
                            actions: "assignInfo",
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
                    actions: assign((context, event: any) => {
                        obj: event.obj;
                    }),
                },
            },
        },
    },
};
