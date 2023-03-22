import { assign, createMachine, ErrorExecutionEvent } from "xstate";
import { PostID, PostType } from "../../constants/DataTypes";
import { MessageType } from "../auth";
import { fetchPost } from "../posts";

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
                        actions: "logError",
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
            postID: PostID | null;
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
            const res = await fetchPost(context.postID);
            if (res.type !== MessageType.success) throw Error(res.message);
            if (!res.data) throw Error("WTF");
            return res.data;
        },
    },
    actions: {
        assignID: assign({ postID: (_, event: any) => event.id }),
        assignPost: assign({ post: (_, event: any) => event.data }),
        logError: (_, event: any) => console.log(event.data),
    },
});
