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
                    actions: "assignIDs",
                },
            },
        },
        "Loading Riders": {
            invoke: {
                src: "loadUsers",
                id: "loadUsers",
                onDone: {
                    target: "Idle",
                    actions: "assignRiders",
                },
                onError: {
                    target: "Failed",
                    actions: "assignError",
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
    actions: {
        assignIDs: assign((_, event: any) => ({ ids: event.ids })),
        assignRiders: assign({ riders: (_, event: any) => event.data }),
        assignError: assign({ error: (_, event: any) => event.data }),
    },
    services: {
        loadUsers: (context) => getUsersOnce(context.ids ? context.ids : []),
    },
});
