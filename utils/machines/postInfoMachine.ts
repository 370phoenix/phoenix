import { assign, createMachine } from "xstate";
import { logError } from "../errorHandling";
import { fetchPost } from "../posts";
import { PostType } from "../postValidation";

const PostInfoMachine = {
    id: "Post Info Machine",
    description: "Used in the Match Card (or anywhere we need to load a post once)",
    initial: "Start",
    states: {
        Start: {
            on: {
                LOAD: {
                    target: "Loading",
                    actions: "assignID",
                },
            },
        },
        Loading: {
            invoke: {
                src: "getPost",
                id: "getPost",
                onDone: [
                    {
                        target: "Loaded",
                        actions: "assignPost",
                    },
                ],
                onError: [
                    {
                        target: "Failed",
                        actions: "logPostError",
                        description: "console log error",
                    },
                ],
            },
        },
        Loaded: {
            on: {
                EXIT: {
                    target: "Complete",
                },
            },
        },
        Failed: {
            type: "final" as "final",
        },
        Complete: {
            type: "final" as "final",
        },
    },
    schema: {
        context: {} as {
            post: PostType | null;
            postID: string | null;
        },
        events: {} as { type: "EXIT" } | { type: "LOAD"; id: string },
    },
    context: { post: null, postID: null },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const postInfoMachine = createMachine(PostInfoMachine, {
    services: {
        getPost: async (context) => {
            if (!context.postID) throw Error("No post ID");
            return await fetchPost(context.postID);
        },
    },
    actions: {
        assignID: assign({ postID: (_, event: any) => event.id }),
        assignPost: assign({ post: (_, event: any) => event.data }),
        logPostError: (_, event: any) => logError(event.data),
    },
});
