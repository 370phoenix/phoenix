import { assign, createMachine } from "xstate";
import { getUserOnce, UserInfo } from "../auth";
import { logError } from "../errorHandling";
import { handleAcceptReject } from "../posts";
import { PostType } from "../postValidation";

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
            | { type: "ACCEPT"; post: PostType; posterID: string; userInfo: UserInfo }
            | { type: "REJECT"; post: PostType; posterID: string; userInfo: UserInfo },
    },
    context: { requesterInfo: null, userID: null },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const requestCardMachine = createMachine(RequestCardMachine, {
    services: {
        getUserInfo: async (context) => {
            return await getUserOnce(context.userID);
        },
        acceptUser: async (context, event) => {
            if (context.userID && event.type === "ACCEPT") {
                await handleAcceptReject({
                    isAccept: true,
                    userInfo: event.userInfo,
                    requesterID: context.userID,
                    requesterInfo: context.requesterInfo,
                    post: event.post,
                    posterID: event.posterID,
                });
            } else throw Error("No info attached to event or Missing ID.");
        },
        rejectUser: async (context, event) => {
            if (context.userID && event.type === "REJECT") {
                await handleAcceptReject({
                    isAccept: false,
                    userInfo: event.userInfo,
                    requesterID: context.userID,
                    requesterInfo: context.requesterInfo,
                    post: event.post,
                    posterID: event.posterID,
                });
            } else throw Error("No info attached to event or Missing ID.");
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
