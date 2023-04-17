import { assign, createMachine, DoneInvokeEvent } from "xstate";
import { UserInfo, validateProfile, writeUser } from "../auth";

const CreateProfileMachine = {
    id: "Create Profile Machine",
    initial: "Start",
    states: {
        "Start": {
            on: {
                ADVANCE: {
                    target: "Information Invalid",
                    actions: "assignPrevInfo",
                },
            },
        },
        "Information Invalid": {
            on: {
                "UPDATE INFO": {
                    target: "Validating Info",
                    actions: "assignStuff",
                },
            },
        },
        "Validating Info": {
            invoke: {
                src: "validateInfo",
                id: "validateInfo",
                onDone: [
                    {
                        target: "Information Valid",
                        cond: "hasChanged",
                        actions: "assignChanged",
                    },
                    {
                        target: "Information Valid",
                        cond: "isValid",
                        actions: "assignUnchanged",
                    },
                    {
                        target: "Information Invalid",
                        actions: "assignError",
                    },
                ],
                onError: {
                    target: "Information Invalid",
                    actions: "assignError",
                },
            },
        },
        "Information Valid": {
            on: {
                "SUBMIT": {
                    target: "Submitting",
                },
                "UPDATE INFO": {
                    target: "Validating Info",
                    actions: "assignStuff",
                },
            },
        },
        "Submitting": {
            invoke: {
                src: "writeUser",
                id: "createProfile",
                onDone: [
                    {
                        target: "Success",
                    },
                ],
                onError: [
                    {
                        target: "Information Valid",
                        actions: "assignError",
                    },
                ],
            },
        },
        "Success": {
            type: "final" as "final",
        },
    },
    schema: {
        context: {} as {
            error: Error | null;
            phone: string | null;
            prevInfo: UserInfo | null;
            rawInfo: {
                username: string;
                major: string;
                gradString: string;
                pronouns: string;
                phone: string | null;
            } | null;
            userInfo: UserInfo | null;
            userID: string | null;
            infoChanged: boolean;
        },
        events: {} as
            | { type: "SUBMIT" }
            | { type: "ADVANCE"; prevInfo: UserInfo | null }
            | {
                type: "UPDATE INFO";
                userID: string;
                info: {
                    username: string;
                    major: string;
                    gradString: string;
                    pronouns: string;
                    phone: string | null;
                };
            }
            | DoneInvokeEvent<UserInfo>,
    },
    context: {
        error: null,
        rawInfo: null,
        userInfo: null,
        phone: null,
        userID: null,
        prevInfo: null,
        infoChanged: false,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const createProfileMachine = createMachine(CreateProfileMachine, {
    services: {
        writeUser: async (context: { userID: string | null; userInfo: UserInfo | null }) => {
            await writeUser(context.userID, context.userInfo);
        },
        validateInfo: async (context: any) => {
            return validateProfile({
                ...context.rawInfo,
                userInfo: context.prevInfo,
                userID: context.userID,
            });
        },
    },
    actions: {
        assignPrevInfo: assign({ prevInfo: (_, event: any) => event.prevInfo }),
        assignUnchanged: assign({
            userInfo: (_, event: any) => event.data,
            infoChanged: false,
        }),
        assignChanged: assign({
            userInfo: (_, event: any) => event.data,
            infoChanged: true,
        }),
        assignStuff: assign({
            rawInfo: (_, event: any) => event.info,
            userID: (_, event: any) => event.userID,
        }),
        assignError: assign({
            error: (_, event: any) => event.data,
        }),
    },
    guards: {
        isValid: (_, event: any) => typeof event.data !== "string",
        hasChanged: (context, event: any) => {
            if (!context.prevInfo) return true;
            return isDifferent(context.prevInfo, event.data);
        },
    },
});

// CAUTION: Only compares 1 level deep
function isDifferent(o1: UserInfo, o2: UserInfo) {
    if (o1.major != o2.major) return true;
    if (o1.pronouns != o2.pronouns) return true;
    if (o1.username != o2.username) return true;
    if (o1.gradYear != o2.gradYear) return true;
    return false;
}
