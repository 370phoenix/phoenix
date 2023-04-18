import { firebase } from "@react-native-firebase/database";
import { createMachine, assign } from "xstate";

import { ChatHeader } from "../chat";

const db = firebase.app().database("https://phoenix-370-default-rtdb.firebaseio.com");

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
        context: {} as { header: ChatHeader | null; postID: string; error: Error | null },
        events: {} as Init | ErrorEvent | Leave | Update,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
};
type Init = { type: "INIT"; postID: string };
type Update = { type: "UPDATE"; data: ChatHeader };
type ErrorEvent = { type: "ERROR"; error: Error };
type Leave = { type: "LEAVE" };

export const chatHeaderMachine = createMachine(ChatHeaderMachine, {
    services: {
        loadHeader: (context) => (callback) => {
            const { postID } = context;
            const res = db.ref(`chats/${postID}`).on("value", (snapshot) => {
                if (snapshot.exists()) {
                    const header = snapshot.val();
                    callback({ type: "UPDATE", data: header });
                } else {
                    callback({ type: "ERROR", error: new Error("Chat does not exist") });
                }
            });

            return () => {
                db.ref(`chats/${postID}`).off("value", res);
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
            error: (_, event) => (event as ErrorEvent).error
        }),
    },
});
