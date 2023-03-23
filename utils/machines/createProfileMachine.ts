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
                        cond: "isValid",
                        actions: "assignInfo",
                    },
                    {
                        target: "Information Invalid",
                        actions: "assignError",
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
    services: {
        writeUser: (context: { userID: string | null; userInfo: UserInfo | null }) =>
            writeUser(context.userID, context.userInfo),
        validateInfo: async (context: any) => {
            return validateProfile({ ...context.rawInfo, userInfo: context.prevInfo });
        },
    },
    actions: {
        assignPrevInfo: assign({ prevInfo: (_, event: any) => event.prevInfo }),
        assignInfo: assign({
            userInfo: (_, event: any) => event.data,
        }),
        assignStuff: assign({
            rawInfo: (_, event: any) => event.info,
            userID: (_, event: any) => event.userID,
        }),
        assignError: assign({ error: (_, event: any) => event.data }),
    },
    guards: {
        isValid: (_, event: any) => typeof event.data !== "string",
    },
});
