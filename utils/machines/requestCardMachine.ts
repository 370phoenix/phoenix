import { assign, createMachine } from "xstate";
import { getUserOnce } from "../auth";
import { logError } from "../errorHandling";
import { getFunctions } from "../functions";
import { FBPostType, PostType } from "../postValidation";
import { UserInfo } from "../userValidation";

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
                  posterID: string;
                  userInfo: UserInfo;
                  onSuccessful: (post: FBPostType) => void;
              }
            | {
                  type: "REJECT";
                  post: PostType;
                  posterID: string;
                  userInfo: UserInfo;
                  onSuccessful: (post: PostType) => void;
              },
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
                const acceptUser = getFunctions().httpsCallable("acceptUser");
                const res = await acceptUser({
                    requesterID: context.userID,
                    post: event.post,
                });
                console.log(res);
                event.onSuccessful(res.data);
            } else throw Error("No info attached to event or Missing ID.");
        },
        rejectUser: async (context, event) => {
            if (context.userID && event.type === "REJECT") {
                const rejectUser = getFunctions().httpsCallable("rejectUser");
                const res = await rejectUser({
                    requesterID: context.userID,
                    post: event.post,
                });
                console.log(res);
                event.onSuccessful(res.data);
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
