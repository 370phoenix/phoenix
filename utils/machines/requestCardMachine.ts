import { assign, createMachine } from "xstate";
import { getUserOnce } from "../auth";
import { logError } from "../errorHandling";
import { getFunctions } from "../functions";
import { FBPostType, PostType } from "../postValidation";
import { UserInfo } from "../userValidation";
import { getAllRequestUpdates } from "../posts";

const RequestCardMachine = {
    id: "Request Card Machine",
    initial: "Start",
    states: {
        Start: {
            on: {
                "LOAD INFO": {
                    target: "Loading",
                    actions: "assignID",
                },
            },
        },
        Loading: {
            invoke: {
                src: "getUserInfo",
                id: "getUserInfo",
                onDone: [
                    {
                        target: "Prompt",
                        actions: "assignRequesterInfo",
                    },
                ],
                onError: [
                    {
                        target: "Failed",
                        actions: "logRequestError",
                    },
                ],
            },
        },
        Prompt: {
            on: {
                ACCEPT: {
                    target: "Accepting",
                },
                REJECT: {
                    target: "Rejecting",
                },
            },
        },
        Accepting: {
            invoke: {
                src: "acceptUser",
                id: "acceptUser",
                onDone: {
                    target: "Complete",
                },
                onError: {
                    target: "Prompt",
                    actions: "logRequestError",
                },
            },
        },
        Rejecting: {
            invoke: {
                src: "rejectUser",
                id: "rejectUser",
                onDone: [
                    {
                        target: "Complete",
                    },
                ],
                onError: [
                    {
                        target: "Prompt",
                        actions: "logRequestError",
                    },
                ],
            },
        },
        Complete: {
            type: "final" as "final",
        },
        Failed: {
            type: "final" as "final",
        },
    },
    schema: {
        context: {} as {
            requesterInfo: UserInfo | null;
            userID: string | null;
        },
        events: {} as
            | { type: "LOAD INFO"; id: string }
            | {
                  type: "ACCEPT";
                  post: PostType;
                  requesterID: string;
                  onSuccessful: (post: FBPostType) => void;
                  onError: (error: Error) => void;
              }
            | {
                  type: "REJECT";
                  post: PostType;
                  requesterID: string;
                  onSuccessful: (post: PostType) => void;
                  onError: (error: Error) => void;
              },
    },
    context: { requesterInfo: null, userID: null },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const getRequestCardMachine = () =>
    createMachine(RequestCardMachine, {
        services: {
            getUserInfo: async (context) => {
                return await getUserOnce(context.userID);
            },
            acceptUser: async (context, event) => {
                if (context.userID && event.type === "ACCEPT") {
                    try {
                        const acceptUser = getFunctions().httpsCallable("acceptUser");
                        const res = await acceptUser({
                            requesterID: event.requesterID,
                            post: event.post,
                        });
                        event.onSuccessful(res.data);
                    } catch (e: any) {
                        event.onError(e);
                    }
                } else throw new Error("No info attached to event or Missing ID.");
            },
            rejectUser: async (context, event) => {
                if (context.userID && event.type === "ACCEPT") {
                    try {
                        const rejectUser = getFunctions().httpsCallable("rejectUser");
                        const res = await rejectUser({
                            requesterID: event.requesterID,
                            post: event.post,
                        });
                        event.onSuccessful(res.data);
                    } catch (e: any) {
                        event.onError(e);
                    }
                } else throw new Error("No info attached to event or Missing ID.");
            },
        },
        actions: {
            logRequestError: (_, event: any) => {
                logError(event.data);
            },
            assignID: assign((_, event: any) => ({ userID: event.id })),
            assignRequesterInfo: assign({ requesterInfo: (_, event: any) => event.data }),
        },
    });
