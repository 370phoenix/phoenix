import { firebase } from "@react-native-firebase/database";
import { createMachine, assign, DoneInvokeEvent } from "xstate";

import { ChatHeader } from "../chat";

const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

const ChatHeaderMachine = {
    initial: "Start",
    states: {
        "Start": {
            on: {
                INIT: {
                    target: "Loading Header",
                    actions: "assignInit",
                },
            },
        },
        "Loading Header": {
            invoke: {
                id: "loadHeader",
                src: "loadHeader",
                onDone: {
                    target: "Loaded",
                    actions: "assignHeader",
                },
                onError: {
                    target: "Error",
                    actions: "assignError",
                },
            },
        },
        "Loaded": {},
        "Error": {},
    },
    context: {
        header: null,
        postID: "",
        error: null,
    },
    schema: {
        context: {} as { header: ChatHeader | null; postID: string; error: string | null },
        events: {} as { type: "INIT"; postID: string },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const chatHeaderMachine = createMachine(ChatHeaderMachine, {
    services: {
        loadHeader: async (context) => {
            const { postID } = context;
            const snapshot = await db.ref(`chats/${postID}`).once("value");
            if (snapshot.exists()) return snapshot.val();
            else throw new Error("Chat does not exist");
        },
    },
    actions: {
        assignInit: assign({
            postID: (_, event) => event.postID,
        }),
        assignHeader: assign({
            header: (_, event: any) => (event as DoneInvokeEvent<ChatHeader>).data,
        }),
        assignError: assign({
            error: (_, event: any) => event.data,
        }),
    },
});
