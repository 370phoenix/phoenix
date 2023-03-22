import { assign, createMachine } from "xstate";
import { getUsersOnce, UserInfo } from "../auth";

const MultipleUserMachine = {
    id: "Multiple User Info Machine",
    description: "Used in Post Details",
    initial: "Start",
    states: {
        "Start": {
            on: {
                LOAD: {
                    target: "Loading Riders",
                    actions: assign((_, event: any) => ({ ids: event.ids })),
                },
            },
        },
        "Loading Riders": {
            invoke: {
                src: "loadUsers",
                id: "loadUsers",
                onDone: {
                    target: "Idle",
                    actions: assign({ riders: (_, event: any) => event.data }),
                },
                onError: {
                    target: "Failed",
                    actions: assign({ error: (_, event: any) => event.data }),
                },
            },
        },
        "Idle": {
            on: {
                EXIT: {
                    target: "Complete",
                },
            },
        },
        "Failed": {
            type: "final" as "final",
        },
        "Complete": {
            type: "final" as "final",
        },
    },
    schema: {
        context: {} as {
            riders: UserInfo[];
            ids: string[];
            error: string | null;
        },
        events: {} as { type: "EXIT" } | { type: "LOAD"; ids: string[] },
    },
    context: { riders: [], ids: [], error: null },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const multipleUserMachine = createMachine(MultipleUserMachine, {
    services: {
        loadUsers: (context) => getUsersOnce(context.ids ? context.ids : []),
    },
});
