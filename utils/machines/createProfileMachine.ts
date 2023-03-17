import { assign, createMachine, DoneInvokeEvent } from "xstate";
import { UserInfo, validateProfile, writeUser } from "../auth";

const CreateProfileMachine = {
    id: "Create Profile Machine",
    initial: "Information Invalid",
    states: {
        "Information Invalid": {
            on: {
                "UPDATE INFO": {
                    target: "Validating Info",
                    actions: assign((_, event: any) => ({
                        rawInfo: event.info,
                        userID: event.userID,
                    })),
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
        "Validating Info": {
            invoke: {
                src: async (context: any) => {
                    return validateProfile(context.userInfo);
                },
                id: "validateInfo",
                onDone: [
                    {
                        target: "Information Valid",
                        cond: "isValid",
                        actions: assign({
                            userInfo: (_, event: DoneInvokeEvent<UserInfo>) => event.data,
                        }),
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
                },
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
            rawInfo: {
                username: string;
                major: string;
                gradString: string;
                gender: string;
                phone: string;
            } | null;
            userInfo: UserInfo | null;
            userID: string | null;
        },
        events: {} as
            | { type: "SUBMIT" }
            | {
                  type: "UPDATE INFO";
                  userID: string;
                  info: {
                      username: string;
                      major: string;
                      gradString: string;
                      gender: string;
                      phone: string;
                  };
              },
    },
    context: { error: "", rawInfo: null, userInfo: null, phone: null, userID: null },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const createProfileMachine = createMachine(CreateProfileMachine, {
    guards: {
        isValid: (_, event: any) => typeof event.data !== "string",
    },
});
