import { assign, createMachine } from "xstate";
import { UserID } from "../../constants/DataTypes";
import { getUserOnce, MessageType, UserInfo } from "../auth";
import { handleAcceptReject } from "../posts";

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
                        actions: assign({ requesterInfo: (_, event: any) => event.data }),
                    },
                ],
                onError: [
                    {
                        target: "Failed",
                        actions: "logError",
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
                onDone: [
                    {
                        target: "Complete",
                    },
                ],
                onError: [
                    {
                        target: "Prompt",
                        actions: "logError",
                    },
                ],
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
                        actions: "logError",
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
            userID: UserID | null;
        },
        events: {} as
            | { type: "LOAD INFO"; id: string }
            | { type: "ACCEPT"; postID: string; posterID: string; userInfo: UserInfo }
            | { type: "REJECT"; postID: string; posterID: string; userInfo: UserInfo },
    },
    context: { requesterInfo: null, userID: null },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const requestCardMachine = createMachine(RequestCardMachine, {
    services: {
        getUserInfo: async (context) => {
            const r1 = await getUserOnce(context.userID);
            if (r1.type !== MessageType.success) throw Error(r1.message);
            else return r1.data;
        },
        acceptUser: async (context, event) => {
            if (context.userID && event.type === "ACCEPT") {
                const r1 = await handleAcceptReject({
                    isAccept: true,
                    userInfo: event.userInfo,
                    requesterID: context.userID,
                    requesterInfo: context.requesterInfo,
                    postID: event.postID,
                    posterID: event.posterID,
                });
                if (r1.type !== MessageType.success) throw Error(r1.message);
                else return;
            } else throw Error("No info attached to event or Missing ID.");
        },
        rejectUser: async (context, event) => {
            if (context.userID && event.type === "REJECT") {
                const r1 = await handleAcceptReject({
                    isAccept: false,
                    userInfo: event.userInfo,
                    requesterID: context.userID,
                    requesterInfo: context.requesterInfo,
                    postID: event.postID,
                    posterID: event.posterID,
                });
                if (r1.type !== MessageType.success) throw Error(r1.message);
                else return;
            } else throw Error("No info attached to event or Missing ID.");
        },
    },
    actions: {
        logError: (_, event) =>
            console.log(
                `ERROR in request machine ${event.type}: ${
                    "data" in event ? event.data : "no message"
                }`
            ),
        assignID: assign((_, event: any) => ({ userID: event.id })),
    },
});
