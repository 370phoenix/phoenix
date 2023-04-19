import { createMachine, assign } from "xstate";

import { ChatHeader } from "../chat";
import { getDB } from "../db";

const ChatHeaderMachine = {
    initial: "Start",
    states: {
        "Start": {
            on: {
                INIT: {
                    target: "Listeners On",
                    actions: "assignInit",
                },
            },
        },
        "Listeners On": {
            invoke: {
                id: "loadHeader",
                src: "loadHeader",
            },
            on: {
                ERROR: {
                    target: "Error",
                    actions: "assignError",
                },
                UPDATE: {
                    target: "Listeners On",
                    actions: "assignHeader",
                },
                LEAVE: {
                    target: "Off",
                },
            },
        },
        "Off": {
            type: "final" as "final",
        },
        "Error": { type: "final" as "final" },
    },
    context: {
        header: null,
        postID: "",
        error: null,
    },
    schema: {
        context: {} as { header: ChatHeader | null; postID: string; error: string | null },
        events: {} as Init | Error | Leave | Update,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
};
type Init = { type: "INIT"; postID: string };
type Update = { type: "UPDATE"; data: ChatHeader };
type Error = { type: "ERROR"; error: string };
type Leave = { type: "LEAVE" };

export const chatHeaderMachine = createMachine(ChatHeaderMachine, {
    services: {
        loadHeader: (context) => (callback) => {
            const { postID } = context;
            const res = getDB()
                .ref(`chats/${postID}`)
                .on("value", (snapshot) => {
                    if (snapshot.exists()) {
                        const header = snapshot.val();
                        callback({ type: "UPDATE", data: header });
                    } else {
                        callback({ type: "ERROR", error: "Chat does not exist" });
                    }
                });

            return () => {
                getDB().ref(`chats/${postID}`).off("value", res);
            };
        },
    },
    actions: {
        assignInit: assign({
            postID: (_, event) => (event as Init).postID,
        }),
        assignHeader: assign({
            header: (_, event) => (event as Update).data,
        }),
        assignError: assign({
            error: (_, event) => (event as Error).error,
        }),
    },
});
