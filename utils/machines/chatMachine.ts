import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { assign, createMachine, DoneInvokeEvent } from "xstate";
import Filter from "bad-words";

import { RootStackParamList } from "../../types";
import {
    loadCache,
    loadMessages,
    sendMessage,
    cacheMessages,
    ChatHeader,
    ChatMessage,
} from "../chat";

const ChatMachine = {
    id: "Chat Machine",
    initial: "Start",
    states: {
        "Start": {
            on: {
                "CHECK CACHE": {
                    target: "Loading Cache",
                    actions: "assignInit",
                },
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
                        cond: "cacheFresh",
                    },
                    {
                        target: "Fetching Chat",
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
                        src: "cacheMessages",
                        id: "cacheMessages",
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
        postID: "",
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
        loadCache: (context, _) => {
            const { postID, header } = context;
            return loadCache(postID, header);
        },
        loadMessages: (context, _) => {
            const { postID } = context;
            return loadMessages(postID);
        },
        sendMessage: async (context, event) => {
            if (event.type !== "TRY MESSAGE") throw new Error("Invalid Event Type");
            const sent = await sendMessage(context.postID, event.message);
            if (typeof sent === "string") throw new Error(sent);
            return event.message;
        },
        cacheMessages: (context, event) => {
            const { postID, messages, header } = context;
            return cacheMessages(postID, messages, header);
        },
        unmatch: async (_context, _event) => {
            // TODO: UNMATCH FUNCTIONALITY
        },
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
            error: (_, event: any) => event.data,
        }),
        assignInit: assign({
            navigation: (_, event: Check) => event.navigation,
            postID: (_, event: Check) => event.header.postID,
            header: (_, event: Check) => event.header,
        }),
        logError: (_, event: any) => console.error(event.data),
        exitView: (context) => context.navigation && context.navigation.goBack(),
    },
    guards: {
        shouldSend: (_, event) => {
            const filter = new Filter();
            return !filter.isProfane((event as TryMessage).message.message);
        },
        cacheFresh: (_, event: any) => event.data !== false,
    },
});

type ChatMachineContext = {
    postID: string;
    messages: ChatMessage[];
    header: ChatHeader | null;
    error: string | null;
    navigation: NativeStackNavigationProp<RootStackParamList, "MatchDetails", undefined> | null;
};
type TryMessage = { type: "TRY MESSAGE"; message: ChatMessage };
type Cache = { type: "CACHE AND LEAVE" };
type Unmatch = { type: "UNMATCH" };
type Check = {
    type: "CHECK CACHE";
    navigation: NativeStackNavigationProp<RootStackParamList, "MatchDetails", undefined>;
    header: ChatHeader;
};
type Recieve = { type: "RECIEVE MESSAGE" };
type Leave = { type: "LEAVE" };
type ChatMachineEvents = TryMessage | Cache | Unmatch | Check | Recieve | Leave;
