import { assign, createMachine } from "xstate";
import { logError } from "../errorHandling";
import { getAllRequestUpdates, Unsubscribe } from "../posts";
import { PostType } from "../postValidation";

const RequestListMachine = {
    id: "Request List Machine",
    initial: "Set Listeners",
    states: {
        "Set Listeners": {
            initial: "Listeners Set",
            invoke: [
                {
                    src: "setListeners",
                    id: "setListeners",
                },
            ],
            states: {
                "Listeners Set": {
                    on: {
                        "ADDED LISTENER FIRED": {
                            target: "Listeners Set",
                            actions: "addPost",
                            internal: false,
                        },
                        "EXIT": {
                            target: "#Request List Machine.Complete",
                        },
                    },
                },
            },
        },
        "Complete": {
            type: "final" as "final",
        },
    },
    schema: {
        context: {} as {
            posts: PostType[];
            isSet: boolean;
            userID: string;
        },
        events: {} as
            | { type: "SET UNSUB"; unsub: Unsubscribe }
            | { type: "ADDED LISTENER FIRED"; post: PostType }
            | { type: "EXIT" },
    },
    context: { posts: [], isSet: false, userID: "" },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const requestListMachine = createMachine(RequestListMachine, {
    services: {
        setListeners: (context) => (callback) => {
            try {
                return getAllRequestUpdates({
                    onChildAdded: (post) => {
                        callback({ type: "ADDED LISTENER FIRED", post });
                    },
                    userID: context.userID,
                });
            } catch (error: any) {
                logError(error);
            }
        },
    },
    actions: {
        addPost: assign((context, event) => {
            return {
                posts: "post" in event ? [...context.posts, event.post] : context.posts,
            };
        }),
    },
});
