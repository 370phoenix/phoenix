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
                    actions: assign({ prevInfo: (_, event: any) => event.prevInfo }),
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
                src: async (context: any) => {
                    return validateProfile({ ...context.rawInfo, userInfo: context.prevInfo });
                },
                id: "validateInfo",
                onDone: [
                    {
                        target: "Information Valid",
                        cond: "isValid",
                        actions: "assignInfo",
                    },
                    {
                        target: "Information Invalid",
                        actions: assign({ error: (_, event: any) => event.data }),
                    },
                ],
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
                src: (context: { userID: string | null; userInfo: UserInfo | null }) =>
                    writeUser(context.userID, context.userInfo),
                id: "createProfile",
                onDone: [
                    {
                        target: "Success",
                    },
                ],
                onError: [
                    {
                        target: "Information Valid",
                        actions: assign({ error: (_, event: any) => event.data }),
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
            error: string;
            phone: string | null;
            prevInfo: UserInfo | null;
            rawInfo: {
                username: string;
                major: string;
                gradString: string;
                gender: string;
                phone: string | null;
            } | null;
            userInfo: UserInfo | null;
            userID: string | null;
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
                      gender: string;
                      phone: string | null;
                  };
              }
            | DoneInvokeEvent<UserInfo>,
    },
    context: {
        error: "",
        rawInfo: null,
        userInfo: null,
        phone: null,
        userID: null,
        prevInfo: null,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const createProfileMachine = createMachine(CreateProfileMachine, {
    actions: {
        assignInfo: assign({
            userInfo: (_, event: DoneInvokeEvent<UserInfo>) => event.data,
        }),
        assignStuff: assign({
            rawInfo: (_, event: any) => event.info,
            userID: (_, event: any) => event.userID,
        }),
    },
    guards: {
        isValid: (_, event: any) => typeof event.data !== "string",
    },
});
