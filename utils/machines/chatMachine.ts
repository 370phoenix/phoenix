import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { assign, createMachine, DoneInvokeEvent } from "xstate";

const ChatMachine = {
    id: "Chat Machine",
    initial: "Start",
    states: {
        "Start": {
            on: {
                "CHECK CACHE": [
                    {
                        target: "Loading Cache",
                        cond: "cacheExistsAndIsFresh",
                        actions: "assignInit",
                    },
                    {
                        target: "Fetching Chat",
                        actions: "assignInit",
                    },
                ],
            },
        },
        "Loading Cache": {
            invoke: {
                src: "loadCache",
                id: "loadCache",
                onDone: [
                    {
                        target: "Chat",
                        actions: "assignMessages",
                    },
                ],
                onError: [
                    {
                        target: "Loading Failure",
                        actions: "assignError",
                    },
                ],
            },
        },
        "Fetching Chat": {
            invoke: {
                src: "loadMessages",
                id: "loadMessages",
                onDone: [
                    {
                        target: "Chat",
                        actions: "assignMessages",
                    },
                ],
                onError: [
                    {
                        target: "Loading Failure",
                        actions: "assignError",
                    },
                ],
            },
        },
        "Loading Failure": {
            description: "maybe we allow retry? Could be expensive tho",
            type: "final" as "final",
        },
        "Chat": {
            initial: "Idle",
            states: {
                "Idle": {
                    initial: "Clean",
                    states: {
                        "Send Failed": {},
                        "Clean": {},
                    },
                    on: {
                        "TRY MESSAGE": {
                            target: "Sending",
                            cond: "shouldSend",
                        },
                        "CACHE AND LEAVE": {
                            target: "Caching",
                        },
                        "UNMATCH": {
                            target: "Unmatching",
                        },
                        "RECIEVE MESSAGE": {
                            target: "Idle",
                            actions: "addMessage",
                            description: "called by firebase Push listener",
                        },
                    },
                },
                "Sending": {
                    invoke: {
                        src: "sendMessage",
                        id: "sendMessage",
                        onDone: [
                            {
                                target: "Idle",
                                actions: "addMessage",
                            },
                        ],
                        onError: [
                            {
                                target: "#Chat Machine.Chat.Idle.Send Failed",
                                actions: "assignError",
                            },
                        ],
                    },
                },
                "Caching": {
                    invoke: {
                        src: "cacheChat",
                        id: "cacheChat",
                        onDone: [
                            {
                                target: "Chat Complete",
                            },
                        ],
                        onError: [
                            {
                                target: "Chat Complete",
                                actions: "logError",
                            },
                        ],
                    },
                },
                "Unmatching": {
                    invoke: {
                        src: "unmatch",
                        id: "unmatch",
                        onDone: [
                            {
                                target: "Chat Complete",
                            },
                        ],
                        onError: [
                            {
                                target: "Unmatch Failed",
                                actions: "assignError",
                            },
                        ],
                    },
                },
                "Unmatch Failed": {
                    on: {
                        LEAVE: {
                            target: "#Chat Machine.Complete",
                        },
                    },
                },
                "Chat Complete": {
                    type: "final" as "final",
                },
            },
            onDone: {
                target: "Complete",
                actions: "exitView",
            },
        },
        "Complete": {
            type: "final" as "final",
        },
    },
    schema: {
        context: {} as ChatMachineContext,
        events: {} as ChatMachineEvents,
    },
    context: {
        postID: null,
        error: null,
        header: null,
        messages: [],
        navigation: null,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const chatMachine = createMachine(ChatMachine, {
    services: {
        loadMessages: async (context, event) => {},
        loadCache: async (context, event) => {},
        sendMessage: async (context, event) => {},
        cacheMessages: async (context, event) => {},
        unmatch: async (context, event) => {},
    },
    actions: {
        addMessage: assign({
            messages: (context, event) => [
                ...context.messages,
                (event as DoneInvokeEvent<ChatMessage>).data,
            ],
        }),
        assignMessages: assign({
            messages: (_, event) => (event as DoneInvokeEvent<ChatMessage[]>).data,
        }),
        assignError: assign({
            error: (_, event) => (event as any).data,
        }),
        assignInit: assign({
            navigation: (_, event: Check) => event.navigation,
            postID: (_, event: Check) => event.postID,
        }),
        logError: (_, event: any) => console.error(event.data),
        exitView: (context) => context.navigation && context.navigation.goBack(),
    },
    guards: {
        shouldSend: (context) => false,
        cacheExistsAndIsFresh: (context) => false,
    },
});

type ChatMachineContext = {
    postID: string | null;
    messages: ChatMessage[];
    header: ChatHeader | null;
    error: string | null;
    navigation: NativeStackNavigationProp<RootStackParamList, "MatchDetails", undefined> | null;
};
type TryMessage = { type: "TRY MESSAGE" };
type Cache = { type: "CACHE AND LEAVE" };
type Unmatch = { type: "UNMATCH" };
type Check = {
    type: "CHECK CACHE";
    navigation: NativeStackNavigationProp<RootStackParamList, "MatchDetails", undefined>;
    postID: string;
};
type Recieve = { type: "RECIEVE MESSAGE" };
type Leave = { type: "LEAVE" };
type ChatMachineEvents = TryMessage | Cache | Unmatch | Check | Recieve | Leave;

export type ChatMessage = {
    uid: string;
    message: string;
    timestamp: number;
};
export type ChatHeader = {
    postID: string;
    title: string;
    displayNames: {
        [uid: string]: string;
    };
    lastUpdated: number;
    lastSender: string;
};
