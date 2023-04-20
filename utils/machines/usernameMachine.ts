import { z } from "zod";
import { createMachine, assign } from "xstate";
import { getDB } from "../db";
import { logError as logErrorOp } from "../errorHandling";

const UsernameMachine = {
    initial: "Start",
    states: {
        "Start": {
            on: {
                LOAD: {
                    target: "Loading Username",
                    actions: "assignID",
                },
            },
        },
        "Loading Username": {
            invoke: {
                src: "loadUsername",
                id: "loadUsernmae",
                onDone: [
                    {
                        target: "Loaded",
                        actions: "assignUsername",
                    },
                ],
                onError: [
                    {
                        target: "Error",
                        actions: ["assignError", "logError"],
                    },
                ],
            },
        },
        "Loaded": {
            type: "final" as "final",
        },
        "Error": {
            type: "final" as "final",
        },
    },
    context: {
        id: null,
        username: null,
        error: null,
    },
    schema: {
        context: {} as { id: string | null; username: string | null; error: Error | null },
        events: {} as LoadEvent,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

type LoadEvent = {
    type: "LOAD";
    id: string;
};

export const usernameMachine = createMachine(UsernameMachine, {
    services: {
        loadUsername: async (context) => {
            const { id } = context;
            const snap = await getDB().ref(`users/${id}/username`).once("value");
            if (snap.exists()) return z.string().parse(snap.val());
            else throw new Error(`Username for (${id}) does not exist`);
        },
    },
    actions: {
        logError: (context, event: any) => {
            logErrorOp(event.data);
        },
        assignError: assign({
            error: (_, event: any) => event.data,
        }),
        assignID: assign({
            id: (_, event) => (event.type === "LOAD" ? event.id : null),
        }),
        assignUsername: assign({
            username: (_, event: any) => event.data,
        }),
    },
});
